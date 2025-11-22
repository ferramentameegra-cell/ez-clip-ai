// Este arquivo deve ser configurado de acordo com a estrutura do projeto
// Ajuste o caminho do AppRouter conforme a estrutura real do seu projeto

import { createTRPCReact } from '@trpc/react-query';
// Ajuste este import conforme a estrutura real do seu projeto
// Possíveis caminhos:
// - '../../../server/_core/router'
// - '../../../server/routers/_app'
// - '../../../server/router'
import type { AppRouter } from '../../../server/_core/router';

export const trpc = createTRPCReact<AppRouter>();


