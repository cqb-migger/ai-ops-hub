from fastapi import APIRouter

router = APIRouter(prefix='/agents')


@router.get('/welcome', tags=['[Agents] Base'])
async def welcome():
    return {'message': 'bye!'}
