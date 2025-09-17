import json
import random
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate random presentation titles
    Args: event - dict with httpMethod
          context - object with attributes: request_id, function_name
    Returns: HTTP response with random presentation title
    '''
    try:
        method: str = event.get('httpMethod', 'GET')
        
        # Handle CORS OPTIONS request
        if method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Max-Age': '86400'
                },
                'isBase64Encoded': False,
                'body': ''
            }
        
        if method == 'GET':
            # Lists of words for generating titles
            topics = [
                'Инновации', 'Технологии', 'Будущее', 'Стратегия', 'Развитие',
                'Трансформация', 'Решения', 'Возможности', 'Перспективы', 'Прогресс',
                'Эффективность', 'Качество', 'Успех', 'Рост', 'Изменения'
            ]
            
            contexts = [
                'в бизнесе', 'в образовании', 'в медицине', 'в науке', 'в IT',
                'в маркетинге', 'в управлении', 'в производстве', 'в финансах', 'в логистике',
                'в дизайне', 'в архитектуре', 'в экологии', 'в спорте', 'в культуре'
            ]
            
            actions = [
                'Новые подходы к', 'Современные методы', 'Актуальные тренды',
                'Эффективные стратегии', 'Инновационные решения', 'Практические аспекты',
                'Ключевые факторы', 'Основные принципы', 'Лучшие практики',
                'Передовой опыт', 'Комплексный анализ', 'Системный подход к'
            ]
            
            # Generate different types of titles
            title_types = [
                f"{random.choice(topics)} {random.choice(contexts)}",
                f"{random.choice(actions)} {random.choice(topics).lower()}",
                f"Как достичь {random.choice(topics).lower()} {random.choice(contexts)}",
                f"{random.choice(topics)}: {random.choice(contexts)[2:]} перспективы",
                f"От идеи к результату: {random.choice(topics).lower()} {random.choice(contexts)}"
            ]
            
            # Select random title
            title = random.choice(title_types)
            
            # Generate subtitle
            subtitles = [
                'Практические рекомендации и кейсы',
                'Анализ современных тенденций',
                'Пошаговое руководство к успеху',
                'Опыт ведущих экспертов',
                'Стратегии и тактики реализации',
                'Инструменты и методики',
                'Тренды и прогнозы развития'
            ]
            
            subtitle = random.choice(subtitles)
            
            result = {
                'title': title,
                'subtitle': subtitle,
                'timestamp': 'generated'
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(result, ensure_ascii=False)
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }