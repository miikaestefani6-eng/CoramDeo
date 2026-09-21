# Zion no WhatsApp

Fundação implementada. A integração usa a API oficial do WhatsApp Business/Meta e mantém o Zion do Coram Deo como motor único de pesquisa.

## Fluxo
1. Usuário autenticado informa seu WhatsApp no Coram Deo.
2. O vínculo fica pendente até confirmação de posse do número.
3. Meta entrega mensagens ao webhook `coram-whatsapp-webhook`.
4. O webhook normaliza o número, evita duplicidade por provider_message_id e procura um vínculo ativo.
5. Somente contas vinculadas e com acesso Coram Deo poderão acionar o Zion.
6. Texto será enviado ao mesmo motor `coram-v1-research`.
7. Áudio será transcrito antes de chegar ao Zion.
8. Respostas serão enviadas pela API oficial do WhatsApp e registradas em `whatsapp_messages`.

## Segredos externos necessários
- WHATSAPP_VERIFY_TOKEN
- WHATSAPP_ACCESS_TOKEN
- WHATSAPP_PHONE_NUMBER_ID
- WHATSAPP_APP_SECRET

Nenhum token deve ser salvo no repositório.

## Próximas etapas
- confirmação segura do vínculo do número;
- validação da assinatura do webhook da Meta;
- ponte texto -> Zion -> WhatsApp;
- envio de mensagens;
- download/transcrição de áudio;
- limites e observabilidade.
