import type { PropsWithChildren } from 'react';

export interface ProtectedRouteProps extends PropsWithChildren {
  redirectTo?: string;
}
