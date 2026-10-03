import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // External services already provide their complete URL.
  if (/^https?:\/\//i.test(req.url)) {
    return next(req);
  }

  const url = `${environment.apiUrls.baseUrl}${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
  return next(req.clone({ url }));
};
