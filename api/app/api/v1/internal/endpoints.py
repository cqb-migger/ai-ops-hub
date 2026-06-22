from fastapi import APIRouter

router = APIRouter(prefix='/internal')


@router.get('/welcome', tags=['[Internal] Base'])
async def welcome():
    return {'message': 'bye!'}
