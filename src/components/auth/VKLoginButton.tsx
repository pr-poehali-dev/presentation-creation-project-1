import React from 'react';
import Icon from '@/components/ui/icon';

interface VKLoginButtonProps {
  onSuccess?: (userData: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

const VKLoginButton: React.FC<VKLoginButtonProps> = ({ 
  onSuccess, 
  onError, 
  className = '' 
}) => {
  const handleVKLogin = () => {
    // Открываем popup для авторизации ВК
    const popup = window.open(
      'https://functions.poehali.dev/b28de329-7284-40cb-81c2-e38695103f5e',
      'vk-auth',
      'width=600,height=400,scrollbars=yes,resizable=yes'
    );

    // Слушаем сообщения от popup
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'VK_AUTH_SUCCESS') {
        popup?.close();
        
        // Сохраняем токен в localStorage
        localStorage.setItem('auth_token', event.data.token);
        localStorage.setItem('user_data', JSON.stringify(event.data.user));
        
        onSuccess?.(event.data.user);
        window.removeEventListener('message', messageHandler);
      }
      
      if (event.data.type === 'VK_AUTH_ERROR') {
        popup?.close();
        onError?.(event.data.error || 'Ошибка авторизации');
        window.removeEventListener('message', messageHandler);
      }
    };

    window.addEventListener('message', messageHandler);
    
    // Закрываем popup если пользователь закрыл окно
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
      }
    }, 1000);
  };

  return (
    <button
      onClick={handleVKLogin}
      className={`flex items-center justify-center gap-3 px-6 py-3 bg-[#4680C2] hover:bg-[#5a8fd6] text-white font-medium rounded-lg transition-colors duration-200 ${className}`}
    >
      <Icon name="User" size={20} />
      <span>Войти через ВКонтакте</span>
    </button>
  );
};

export default VKLoginButton;