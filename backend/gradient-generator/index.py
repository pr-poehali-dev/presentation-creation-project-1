import json
import random
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate beautiful CSS gradients for presentation backgrounds
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name, function_version, memory_limit_in_mb
    Returns: HTTP response dict with gradient CSS
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    # Beautiful gradient color palettes
    gradient_palettes = [
        # Professional blues
        ['#667eea', '#764ba2'],
        ['#667eea', '#f093fb'],
        ['#4facfe', '#00f2fe'],
        ['#43e97b', '#38f9d7'],
        
        # Warm sunset
        ['#fa709a', '#fee140'],
        ['#ffecd2', '#fcb69f'],
        ['#ff9a9e', '#fecfef'],
        ['#ff8a80', '#ea4c46'],
        
        # Cool ocean
        ['#a8edea', '#fed6e3'],
        ['#30cfd0', '#91a7ff'],
        ['#a1c4fd', '#c2e9fb'],
        ['#fbc2eb', '#a6c1ee'],
        
        # Purple magic
        ['#667eea', '#764ba2'],
        ['#f093fb', '#f5576c'],
        ['#c471f5', '#fa71cd'],
        ['#b721ff', '#21d4fd'],
        
        # Green nature
        ['#56ab2f', '#a8e6cf'],
        ['#11998e', '#38ef7d'],
        ['#00b09b', '#96c93d'],
        ['#1e3c72', '#2a5298'],
        
        # Orange energy
        ['#ff7e5f', '#feb47b'],
        ['#ff6b6b', '#feca57'],
        ['#ffa726', '#fb8c00'],
        ['#ff9966', '#ff5722']
    ]
    
    # Gradient directions
    directions = [
        'to right',
        'to left', 
        'to bottom',
        'to top',
        'to bottom right',
        'to bottom left',
        'to top right',
        'to top left',
        '45deg',
        '135deg',
        '225deg',
        '315deg'
    ]
    
    if method == 'GET':
        params = event.get('queryStringParameters', {}) or {}
        theme = params.get('theme', 'random')
        
        # Select gradient based on theme
        if theme == 'professional':
            palette = random.choice(gradient_palettes[:4])  # Blues
        elif theme == 'warm':
            palette = random.choice(gradient_palettes[4:8])  # Sunset
        elif theme == 'cool':
            palette = random.choice(gradient_palettes[8:12])  # Ocean
        elif theme == 'creative':
            palette = random.choice(gradient_palettes[12:16])  # Purple
        elif theme == 'nature':
            palette = random.choice(gradient_palettes[16:20])  # Green
        elif theme == 'energy':
            palette = random.choice(gradient_palettes[20:24])  # Orange
        else:
            palette = random.choice(gradient_palettes)  # Random
        
        direction = random.choice(directions)
        
        # Create gradient CSS
        gradient_css = f"linear-gradient({direction}, {palette[0]}, {palette[1]})"
        
        # Additional gradient variations
        variations = []
        for i in range(3):
            var_palette = random.choice(gradient_palettes)
            var_direction = random.choice(directions)
            variations.append({
                'css': f"linear-gradient({var_direction}, {var_palette[0]}, {var_palette[1]})",
                'colors': var_palette,
                'direction': var_direction
            })
        
        result = {
            'gradient': gradient_css,
            'colors': palette,
            'direction': direction,
            'theme': theme,
            'variations': variations,
            'request_id': context.request_id
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps(result)
        }
    
    elif method == 'POST':
        try:
            body_data = json.loads(event.get('body', '{}'))
            custom_colors = body_data.get('colors', [])
            custom_direction = body_data.get('direction', 'to right')
            
            if len(custom_colors) >= 2:
                gradient_css = f"linear-gradient({custom_direction}, {custom_colors[0]}, {custom_colors[1]})"
                
                result = {
                    'gradient': gradient_css,
                    'colors': custom_colors[:2],
                    'direction': custom_direction,
                    'custom': True,
                    'request_id': context.request_id
                }
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps(result)
                }
            else:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Need at least 2 colors for gradient'})
                }
                
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid JSON in request body'})
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }