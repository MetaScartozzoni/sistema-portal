const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_SECRET_KEY = import.meta.env.VITE_API_SECRET_KEY;
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT, 10) || 30000;

const handleApiError = (error, context) => {
  console.error(`${context} Error:`, error);
  if (error.name === 'AbortError') {
    throw new Error('A requisição demorou muito e foi cancelada.');
  }
  throw new Error(error.message || `Ocorreu um erro em ${context}.`);
};

const apiFetch = async (endpoint, options = {}, token = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  const headers = {
    'X-API-Key': API_SECRET_KEY,
    ...options.headers,
  };
  
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { 
      ...options, 
      headers,
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      throw new Error(errorData.message || `Erro HTTP! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    handleApiError(error, `apiFetch ${endpoint}`);
  }
};

const createFallbackData = (data) => ({ success: true, data });

export const getAppointmentsForDay = async (doctorId, date, token) => {
  try {
    return await apiFetch(`/api/appointments?doctor_id=${doctorId}&date=${date}`, { headers: { 'Content-Type': 'application/json' } }, token);
  } catch (error) {
    console.warn('Fallback: getAppointmentsForDay', error.message);
    return createFallbackData([
      { id: 1, appointment_time: new Date().toISOString(), reason: 'Consulta de Rotina (Exemplo)', patient: { id: 1, full_name: 'Paciente Exemplo 1' } },
      { id: 2, appointment_time: new Date().toISOString(), reason: 'Retorno (Exemplo)', patient: { id: 2, full_name: 'Paciente Exemplo 2' } },
    ]);
  }
};

export const getAppointmentsForMonth = async (doctorId, startDate, endDate, token) => {
  try {
    return await apiFetch(`/api/appointments?doctor_id=${doctorId}&start_date=${startDate}&end_date=${endDate}`, { headers: { 'Content-Type': 'application/json' } }, token);
  } catch (error) {
    console.warn('Fallback: getAppointmentsForMonth', error.message);
    return createFallbackData([
      { id: 1, appointment_time: new Date().toISOString(), title: 'Consulta Exemplo', visit_type: 'consulta', notes: 'Discussão sobre pré-operatório.', patient: { id: 1, full_name: 'Paciente Exemplo 1' }, whereby_link: 'https://marcioplasticsurgery.whereby.com/exemplo-1' },
      { id: 2, appointment_time: new Date().toISOString(), title: 'Evento Pessoal (Exemplo)', visit_type: 'pessoal', notes: 'Reunião de equipe semanal.' },
    ]);
  }
};

export const getSurgeriesForMonth = async (doctorId, startDate, endDate, token) => {
  try {
    return await apiFetch(`/api/procedures?doctor_id=${doctorId}&start_date=${startDate}&end_date=${endDate}&type=surgery`, { headers: { 'Content-Type': 'application/json' } }, token);
  } catch (error) {
    console.warn('Fallback: getSurgeriesForMonth', error.message);
    return createFallbackData([
      { id: 3, appointment_time: new Date().toISOString(), title: 'Rinoplastia (Exemplo)', visit_type: 'cirurgia', notes: 'Início às 08:00.', patient: { id: 3, full_name: 'Paciente Cirurgia Exemplo' } },
    ]);
  }
};

const addEvent = (eventData, token) => apiFetch('/api/appointments', { method: 'POST', body: JSON.stringify({ ...eventData, status: 'scheduled' }), headers: { 'Content-Type': 'application/json' } }, token);

export const addAppointment = (eventData, token) => addEvent(eventData, token);
export const addSurgery = (eventData, token) => addEvent(eventData, token);
export const addPersonalEvent = (eventData, token) => addEvent(eventData, token);


export const getRecentActivities = async (token) => {
  try {
    return await apiFetch('/api/activities/recent', { headers: { 'Content-Type': 'application/json' } }, token);
  } catch (error) {
    console.warn('Fallback: getRecentActivities', error.message);
    return createFallbackData([
        { id: 1, type: 'document_created', description: 'Documento criado (Exemplo)', occurred_at: new Date().toISOString() },
        { id: 2, type: 'evolution_updated', description: 'Evolução atualizada (Exemplo)', occurred_at: new Date().toISOString() },
    ]);
  }
};

export const getPatientJourneys = async (doctorId, token) => {
  try {
    return await apiFetch(`/api/patients?doctor_id=${doctorId}&include_journey=true`, { headers: { 'Content-Type': 'application/json' } }, token);
  } catch (error) {
    console.warn('Fallback: getPatientJourneys', error.message);
    return createFallbackData([
      { 
        id: 1, 
        patient: { id: 1, full_name: 'Ana Beatriz (Exemplo)', phone: '(11) 98765-4321', email: 'ana.b@example.com', surgery_date: '2025-08-28', first_contact_date: '2025-08-01' }, 
        protocol: { name: 'Protocolo Padrão' }, 
        current_stage: { name: '1º Retorno Pós-Operatório', position: 12, deadline: { type: 'post_op', return_number: 1 } }, 
        status: 'on-track',
        last_completed_timestamp: '2025-08-28T10:00:00Z'
      },
      { 
        id: 2, 
        patient: { id: 2, full_name: 'Carlos Eduardo (Exemplo)', phone: '(21) 91234-5678', email: 'cadu@example.com', surgery_date: '2025-09-10', first_contact_date: '2025-08-10' }, 
        protocol: { name: 'Protocolo Avançado' }, 
        current_stage: { name: 'Envio de Orçamento', position: 4, deadline: { type: 'after_previous', days: 2 } }, 
        status: 'delayed',
        last_completed_timestamp: '2025-08-15T14:30:00Z'
      },
    ]);
  }
};

export const getPatientEvolutionHistory = async (patientId, token) => {
  try {
      return await apiFetch(`/api/patients/${patientId}/evolutions`, { headers: { 'Content-Type': 'application/json' } }, token);
  } catch (error) {
      console.warn('Fallback: getPatientEvolutionHistory', error.message);
      return createFallbackData([
          {
              id: 101,
              evolution_date: '2025-08-10',
              days_post_op: 9,
              status: 'monitoring',
              vitals: { weight: '84', edema: '2+', drainVolume: '50', painScale: [4] },
              wound_state: 'Apresenta boa cicatrização, sem sinais de infecção.',
              complaint: 'Relata dor moderada na área da incisão.'
          },
          {
              id: 102,
              evolution_date: '2025-08-05',
              days_post_op: 4,
              status: 'monitoring',
              vitals: { weight: '85', edema: '3+', drainVolume: '100', painScale: [7] },
              wound_state: 'Edema e equimose significativos, conforme esperado.',
              complaint: 'Dificuldade para se mover, dor intensa.'
          },
          {
            id: 103,
            evolution_date: '2025-08-02',
            days_post_op: 1,
            status: 'pending',
            vitals: { weight: '86', edema: '4+', drainVolume: '150', painScale: [8] },
            wound_state: 'Curativo oclusivo, limpo e seco.',
            complaint: 'Muito sonolenta e com dor.'
        }
      ]);
  }
};

export const getPatients = async (doctorId, token) => {
  try {
    return await apiFetch(`/api/patients?doctor_id=${doctorId}`, { headers: { 'Content-Type': 'application/json' } }, token);
  } catch (error) {
    console.warn('Fallback: getPatients', error.message);
    return createFallbackData([
      { id: '1', full_name: 'Ana Beatriz (Exemplo)' },
      { id: '2', full_name: 'Carlos Eduardo (Exemplo)' },
      { id: '3', full_name: 'Daniela Freitas (Exemplo)' },
      { id: '4', full_name: 'Eduardo Pereira (Exemplo)' },
      { id: '5', full_name: 'Fabiana Lima (Exemplo)' },
    ]);
  }
};

export const createWherebyMeeting = async (meetingData, token) => {
  try {
    return await apiFetch('/api/meetings/whereby', { method: 'POST', body: JSON.stringify(meetingData), headers: { 'Content-Type': 'application/json' } }, token);
  } catch (error) {
    console.warn('Fallback: createWherebyMeeting', error.message);
    const randomId = Math.random().toString(36).substring(7);
    return createFallbackData({ roomUrl: `https://marcioplasticsurgery.whereby.com/exemplo-${randomId}` });
  }
};

export const sendMessage = async (messageData, token) => {
  try {
    console.log('Sending SMS:', messageData);
    return await apiFetch('/api/messages/sms', { method: 'POST', body: JSON.stringify(messageData), headers: { 'Content-Type': 'application/json' } }, token);
  } catch (error) {
    console.warn('Fallback: sendMessage', error.message);
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
  }
};

export const sendEmail = async (emailData, token) => {
  try {
    const formData = new FormData();
    formData.append('patientId', emailData.patientId);
    formData.append('subject', emailData.subject);
    formData.append('body', emailData.body);
    if (emailData.attachments) {
      emailData.attachments.forEach(file => {
        formData.append('attachments[]', file);
      });
    }
    
    console.log('Sending Email with attachments:', {
      patientId: emailData.patientId,
      subject: emailData.subject,
      body: emailData.body,
      attachments: emailData.attachments.map(f => ({ name: f.name, size: f.size }))
    });

    // Em uma implementação real, você enviaria o formData.
    // return await apiFetch('/api/messages/email', { method: 'POST', body: formData }, token);
    
    // Simulação de sucesso
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
  } catch (error) {
    handleApiError(error, 'sendEmail');
  }
};


export const advanceJourneyStage = (journeyId, token) => apiFetch(`/api/patients/${journeyId}/advance-stage`, { method: 'POST' }, token);
export const saveDocument = (documentData, token) => apiFetch('/api/documents', { method: 'POST', body: JSON.stringify(documentData), headers: { 'Content-Type': 'application/json' } }, token);
export const getDoctorInfo = (doctorId, token) => apiFetch(`/api/doctors/${doctorId}`, { headers: { 'Content-Type': 'application/json' } }, token);
export const testApiConnection = () => apiFetch('/api/health', { headers: { 'Content-Type': 'application/json' } });