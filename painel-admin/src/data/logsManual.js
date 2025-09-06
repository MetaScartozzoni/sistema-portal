export const getMockLogsManual = () => ({
  API_503: {
    title: 'Erro de API: Serviço Indisponível (503)',
    description: 'Este erro indica que nosso sistema não conseguiu se comunicar com um serviço externo, como o Portal do Paciente. Geralmente, isso significa que o serviço parceiro está temporariamente offline ou sobrecarregado.',
    causes: [
      'O serviço externo está em manutenção.',
      'Houve uma falha inesperada no servidor do parceiro.',
      'Problema de rede entre nosso sistema e o parceiro.'
    ],
    quickActions: [
      'Aguarde alguns minutos e tente novamente. O problema pode ser temporário.',
      'Verifique a página de status do serviço parceiro, se disponível.',
      'A funcionalidade dependente deste serviço ficará indisponível até a restauração da conexão.'
    ],
    nextSteps: 'Nossa equipe técnica já foi notificada automaticamente. Estamos monitorando a situação e trabalhando com o parceiro para resolver o problema o mais rápido possível. Nenhuma ação manual é necessária no momento.'
  },
  PERM_001: {
    title: 'Aviso: Alteração de Permissões de Usuário',
    description: 'Este log é um aviso de segurança para informar que as permissões de um usuário foram modificadas. É uma boa prática revisar essa alteração para garantir que ela foi intencional.',
    causes: [
      'Um administrador alterou manualmente as permissões de um usuário na tela de "Permissões".',
      'Uma regra automática do sistema promoveu ou rebaixou um usuário, alterando suas permissões.'
    ],
    quickActions: [
      'Verifique se o usuário que realizou a alteração ("Admin" neste caso) tinha autorização para fazê-lo.',
      'Confirme se as novas permissões concedidas ao usuário estão corretas e de acordo com sua função.'
    ],
    nextSteps: 'Se a alteração for inesperada ou suspeita, entre em contato com o administrador do sistema. É importante garantir que os usuários tenham apenas as permissões necessárias para suas funções (Princípio do Menor Privilégio).'
  },
  DEFAULT: {
    title: 'Log Informativo',
    description: 'Este é um log padrão para eventos rotineiros do sistema.',
    causes: ['Ações normais do usuário ou do sistema.'],
    quickActions: ['Nenhuma ação é necessária.'],
    nextSteps: 'Este log serve apenas para registro histórico das atividades.'
  }
});