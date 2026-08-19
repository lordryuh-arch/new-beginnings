# Plano de Evolução: Ecossistema Social Pokémon Idle

Transformar o projeto atual em uma plataforma comunitária completa para treinadores, onde a jogabilidade idle alimenta uma camada social rica, preservando toda a lógica e economia existente.

## 1. Análise e Infraestrutura
- Mapear tabelas Supabase existentes (`trainer_state`, `pokemon_collection`, `guilds`).
- Identificar eventos do jogo que podem gerar posts automáticos (ex: capturar lendário, atingir nível 100).
- Criar rotas base para a camada social sem interferir na rota `/idle`.

## 2. Camada Social (Feed e Perfil)
- **Feed Comunitário**: Implementar um feed moderno com posts de treinadores e conquistas automáticas.
- **Perfil do Treinador**: Expandir a identidade do jogador com avatar, bio, medalhas e vitrine de Pokémon.
- **Trainer Book**: Criar uma interface tipo "diário de bordo" que registra a jornada cronológica do jogador.

## 3. Integração Jogo-Comunidade
- **Cartas Colecionáveis**: Gerar cartas visuais (estilo TCG) baseadas em capturas raras que podem ser exibidas no perfil.
- **Clubes e Guildas**: Estender o sistema de guildas atual para incluir fóruns internos, missões cooperativas e chat.
- **Notificações**: Sistema de alertas para interações sociais (curtidas, novos seguidores) e eventos do jogo.

## 4. Interface e Experiência
- **Design Premium**: Aplicar a estética "Dark Obsidian/Purple Energy" sugerida na referência, mantendo a identidade visual do jogo.
- **Navegação Moderna**: Sidebar/Top bar no desktop e Bottom bar no mobile, integrando o HUD do jogo suavemente.
- **Performance**: Implementar paginação infinita no feed e lazy loading de imagens dos monstrinhos.

## Detalhes Técnicos
- **Frontend**: Componentes React 19/TanStack Start, estilização com Tailwind v4.
- **Backend**: Server Functions para persistência social, garantindo que recompensas comunitárias passem pelo anti-cheat.
- **Segurança**: RLS rigoroso no Supabase para impedir que a camada social exponha dados sensíveis ou permita manipulação de saves.
- **Incremental**: Nenhuma alteração deve quebrar a rota `/idle` ou o loop de batalha atual.
