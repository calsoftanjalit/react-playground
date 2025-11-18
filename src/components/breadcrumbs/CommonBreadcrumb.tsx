import { Breadcrumbs, Anchor } from '@mantine/core';
import { Link, useLocation, matchRoutes } from 'react-router-dom';
import { routes } from '@/routes/routes';

export const CommonBreadcrumb = () => {
  const location = useLocation();

  const matched = matchRoutes(routes, location);

  const items = matched?.map((m, index) => {
    const routePath = m.route.path ?? '';
    const fullPath = m.pathname;

    const label = routePath.startsWith(':')
      ? location.pathname.split('/').pop()
      : routePath || 'Home';

    const isLast = index === matched.length - 1;

    return isLast ? (
      <span key={fullPath}>{label}</span>
    ) : (
      <Anchor component={Link} to={fullPath} key={fullPath}>
        {label}
      </Anchor>
    );
  });

  return (
    <Breadcrumbs separator="›" mt="sm">
      {items}
    </Breadcrumbs>
  );
};
