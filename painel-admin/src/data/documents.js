export const getMockDocuments = () => ({
    institutional: [
        { id: 'doc1', type: 'documento', title: 'Termos de Serviço', content: 'Conteúdo completo dos termos de serviço...', category: 'Institucional' },
        { id: 'doc2', type: 'documento', title: 'Política de Privacidade', content: 'Conteúdo completo da política de privacidade...', category: 'Institucional' },
    ],
    emailTemplates: [
        { id: 'doc3', type: 'email', title: 'Confirmação de Consulta', content: 'Olá [NOME], sua consulta foi confirmada para...', category: 'Modelos de Email' },
    ],
    messageTemplates: [
        { id: 'doc4', type: 'mensagem', title: 'Lembrete de Aniversário', content: 'Feliz aniversário, [NOME]! Muitas felicidades...', category: 'Modelos de Mensagem' },
    ]
});