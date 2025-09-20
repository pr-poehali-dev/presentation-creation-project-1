import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    if (error) {
      // Отправляем ошибку в родительское окно
      window.opener?.postMessage({
        type: 'VK_AUTH_ERROR',
        error: error
      }, window.location.origin);
      window.close();
      return;
    }

    if (code) {
      // Отправляем код авторизации в бэкенд для получения токена
      fetch(`https://functions.poehali.dev/b28de329-7284-40cb-81c2-e38695103f5e?code=${code}&state=${state}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Отправляем успешный результат в родительское окно
            window.opener?.postMessage({
              type: 'VK_AUTH_SUCCESS',
              token: data.token,
              user: data.user
            }, window.location.origin);
          } else {
            throw new Error(data.error || 'Authentication failed');
          }
        })
        .catch(error => {
          // Отправляем ошибку в родительское окно
          window.opener?.postMessage({
            type: 'VK_AUTH_ERROR',
            error: error.message || 'Authentication failed'
          }, window.location.origin);
        })
        .finally(() => {
          window.close();
        });
    } else {
      // Если нет кода и нет ошибки - перенаправляем на авторизацию
      window.location.href = 'https://functions.poehali.dev/b28de329-7284-40cb-81c2-e38695103f5e';
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Завершение авторизации...</p>
      </div>
    </div>
  );
};

export default AuthCallback;