from fastapi import APIRouter

router = APIRouter(prefix='/chat')


@router.get('/completions', tags=['[Chat] Base'])
async def completions():
    return {'message': 'completions'}
