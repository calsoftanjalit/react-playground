import { Breadcrumbs, Anchor } from '@mantine/core';
import { Link, useLocation, matchRoutes } from 'react-router-dom';
import { routes } from '@/routes/routes';
import { IconChevronRight } from '@tabler/icons-react';

export const Breadcrumb = () => {
  const location = useLocation();

  const matched = matchRoutes(routes, location);

  const items: React.ReactNode[] = [];

  matched?.forEach((matchedRoute, index) => {
    const routePath = matchedRoute.route.path ?? '';
    const fullPath = matchedRoute.pathname;

    if (fullPath === '/' || routePath === '' || routePath === '/') {
      items.push(
        index === matched.length - 1 ? (
          <span key={fullPath}>Home</span>
        ) : (
          <Anchor component={Link} to={fullPath} key={fullPath}>
            Home
          </Anchor>
        )
      );
      return;
    }

    const segments = routePath.split('/').filter(Boolean);
    const fullPathSegments = fullPath.split('/').filter(Boolean);

    segments.forEach((segment, segIdx) => {
      let label;
      // If segment is a param (starts with ':'), use actual value from fullPath
      if (segment.startsWith(':')) {
        const paramValue = fullPathSegments[segIdx];
        label = paramValue
          ? paramValue.charAt(0).toUpperCase() + paramValue.slice(1).replace(/\s+/g, '')
          : segment;
      } else {
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }

      const pathUpToSegment = '/' + fullPathSegments.slice(0, segIdx + 1).join('/');

      const isLast = index === matched.length - 1 && segIdx === segments.length - 1;

      items.push(
        isLast ? (
          <span key={pathUpToSegment}>{label}</span>
        ) : (
          <Anchor component={Link} to={pathUpToSegment} key={pathUpToSegment}>
            {label}
          </Anchor>
        )
      );
    });
  });

  return (
    <Breadcrumbs separator={<IconChevronRight size={20} />} mt="sm">
      {items}
    </Breadcrumbs>
  );
};
