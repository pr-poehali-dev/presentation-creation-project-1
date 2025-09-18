import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get presentation agenda items from database
    Args: event - dict with httpMethod
          context - object with attributes: request_id, function_name
    Returns: HTTP response with agenda items
    '''
    try:
        method: str = event.get('httpMethod', 'GET')
        
        # Handle CORS OPTIONS request
        if method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Max-Age': '86400'
                },
                'isBase64Encoded': False,
                'body': ''
            }
        
        if method == 'GET':
            # Connect to database
            dsn = os.environ.get('DATABASE_URL')
            if not dsn:
                return {
                    'statusCode': 500,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Database URL not configured'})
                }
            
            conn = psycopg2.connect(dsn)
            cursor = conn.cursor()
            
            # Table exists via migration, just fetch data
            
            # Fetch agenda items
            cursor.execute('''
                SELECT id, number, title, duration, sort_order 
                FROM presentation_agenda 
                ORDER BY sort_order
            ''')
            
            rows = cursor.fetchall()
            
            agenda_items = []
            for row in rows:
                agenda_items.append({
                    'id': row[0],
                    'number': row[1],
                    'title': row[2],
                    'duration': row[3],
                    'sort_order': row[4]
                })
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'items': agenda_items}, ensure_ascii=False)
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