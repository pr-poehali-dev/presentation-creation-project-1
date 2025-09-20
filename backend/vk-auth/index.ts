/**
 * ВК OAuth авторизация - обработка входа через ВКонтакте
 * Args: event с httpMethod, queryStringParameters (code, state); context с requestId
 * Returns: HTTP response с токеном или редиректом
 */

exports.handler = async (event, context) => {
    const { httpMethod, queryStringParameters } = event;
    
    // Handle CORS OPTIONS request
    if (httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            body: ''
        };
    }
    
    const VK_APP_ID = process.env.VK_APP_ID;
    const VK_APP_SECRET = process.env.VK_APP_SECRET;
    const REDIRECT_URI = process.env.VK_REDIRECT_URI || 'https://your-domain.com/auth/callback';
    
    if (!VK_APP_ID || !VK_APP_SECRET) {
        return {
            statusCode: 500,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'VK credentials not configured' })
        };
    }
    
    if (httpMethod === 'GET') {
        const { code, state, error } = queryStringParameters || {};
        
        // Обработка ошибки авторизации
        if (error) {
            return {
                statusCode: 400,
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    error: 'VK authorization failed', 
                    details: error 
                })
            };
        }
        
        // Если нет кода - отправляем на авторизацию ВК
        if (!code) {
            const redirectUri = `https://oauth.vk.com/authorize?client_id=${VK_APP_ID}&display=popup&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&v=5.131`;
            
            return {
                statusCode: 302,
                headers: {
                    'Location': redirectUri,
                    'Access-Control-Allow-Origin': '*'
                },
                body: ''
            };
        }
        
        try {
            // Обмениваем код на токен доступа
            const tokenUrl = `https://oauth.vk.com/access_token?client_id=${VK_APP_ID}&client_secret=${VK_APP_SECRET}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code=${code}`;
            
            const tokenResponse = await fetch(tokenUrl);
            const tokenData = await tokenResponse.json();
            
            if (!tokenData.access_token) {
                throw new Error('Failed to get access token');
            }
            
            // Получаем данные пользователя
            const userUrl = `https://api.vk.com/method/users.get?access_token=${tokenData.access_token}&fields=photo_100,screen_name&v=5.131`;
            const userResponse = await fetch(userUrl);
            const userData = await userResponse.json();
            
            if (!userData.response || userData.response.length === 0) {
                throw new Error('Failed to get user data');
            }
            
            const user = userData.response[0];
            
            // Создаем JWT токен для сессии
            const sessionToken = Buffer.from(JSON.stringify({
                vk_id: user.id,
                name: `${user.first_name} ${user.last_name}`,
                avatar: user.photo_100,
                screen_name: user.screen_name,
                email: tokenData.email,
                expires: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 дней
            })).toString('base64');
            
            // Возвращаем HTML страницу, которая передаст данные в родительское окно
            const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Авторизация...</title>
</head>
<body>
    <script>
        window.opener.postMessage({
            type: 'VK_AUTH_SUCCESS',
            token: '${sessionToken}',
            user: ${JSON.stringify({
                id: user.id,
                name: `${user.first_name} ${user.last_name}`,
                avatar: user.photo_100,
                screen_name: user.screen_name,
                email: tokenData.email
            })}
        }, '*');
        window.close();
    </script>
    <p>Авторизация успешна! Это окно закроется автоматически...</p>
</body>
</html>`;
            
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                },
                body: html
            };
            
        } catch (error) {
            console.error('VK Auth Error:', error);
            
            const errorHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Ошибка авторизации</title>
</head>
<body>
    <script>
        window.opener.postMessage({
            type: 'VK_AUTH_ERROR',
            error: '${error.message || 'Authentication failed'}'
        }, '*');
        setTimeout(() => window.close(), 3000);
    </script>
    <p>Ошибка авторизации: ${error.message}</p>
    <p>Это окно закроется автоматически...</p>
</body>
</html>`;
            
            return {
                statusCode: 200,
                headers: { 
                    'Content-Type': 'text/html; charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                },
                body: errorHtml
            };
        }
    }
    
    return {
        statusCode: 405,
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Method not allowed' })
    };
};