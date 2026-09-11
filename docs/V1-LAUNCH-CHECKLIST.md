# Coram Deo V1 — checklist de lançamento

## Técnicos
- [x] Build Next.js verde na Vercel
- [x] Autenticação e proteção de rotas
- [x] Entitlement de assinatura
- [x] Webhook Kiwify
- [x] Devocional
- [x] Estudos e persistência
- [x] Biblioteca
- [x] Favoritos e anotações
- [x] Planos de leitura
- [x] Notificações
- [x] Painel administrativo
- [x] CMS de conteúdos
- [x] Gestão administrativa de planos e preços

## Configuração externa antes de abrir a V1
- [ ] Definir `NEXT_PUBLIC_KIWIFY_CHECKOUT_URL` na Vercel para Production e Preview e redeployar.
- [ ] Confirmar que `/assinatura` exibe o botão/link real do checkout Kiwify.
- [ ] Ativar proteção contra senhas vazadas em Supabase Auth > Providers > Email (se o plano da organização oferecer o recurso).
- [ ] Revisar e aprovar juridicamente Termos de Uso e Política de Privacidade; os documentos atuais são rascunhos e não devem ser publicados sem revisão.
- [ ] Após aprovação, publicar os documentos legais e reexecutar `coram_v1_release_gate_status()`.

## Fora desta etapa
- Sião/Zion permanece adiado conforme decisão de escopo.
- Sistema geral de progresso/gamificação permanece fora da V1; retomada do último estudo foi mantida como funcionalidade mínima.
