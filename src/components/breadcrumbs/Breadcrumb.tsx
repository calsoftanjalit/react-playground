import { Breadcrumbs, Anchor } from '@mantine/core';
import { Link, useLocation, matchRoutes } from 'react-router-dom';
import { routes } from '@/routes/routes';
import { IconChevronRight } from '@tabler/icons-react';

export const Breadcrumb = () => {
  const location = useLocation();

  const matched = matchRoutes(routes, location);

  const items = matched?.map((matchedRoute, index) => {
    const routePath = matchedRoute.route.path ?? '';
    const fullPath = matchedRoute.pathname;

    let label = routePath.startsWith(':')
      ? location.pathname.split('/').pop()
      : routePath.replace('/', '') || 'Home'; 

    if (fullPath === '/' || label === '') {
      label = 'Home';
    }

    label = (label ?? '').charAt(0).toUpperCase() + (label ?? '').slice(1);

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
    <Breadcrumbs separator={<IconChevronRight size={20} />} mt="sm">
      {items}
    </Breadcrumbs>
  );
};
