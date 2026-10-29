from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

import models, schemas
from databases import get_db
from security import get_current_user

router = APIRouter(prefix="/resources", tags=["resources"])


async def get_resource_or_404(resource_id: int, db: AsyncSession) -> models.Resource:
    result = await db.execute(select(models.Resource).where(models.Resource.id == resource_id))
    resource = result.scalar_one_or_none()
    if resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource


@router.get("", response_model=List[schemas.ResourceOut])
async def list_resources(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    query = select(models.Resource).order_by(models.Resource.created_at.desc())
    if category:
        query = query.where(models.Resource.category == category)
    if search:
        query = query.where(models.Resource.title.ilike(f"%{search}%"))
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{resource_id}", response_model=schemas.ResourceOut)
async def get_resource(resource_id: int, db: AsyncSession = Depends(get_db)):
    return await get_resource_or_404(resource_id, db)


@router.post("", response_model=schemas.ResourceOut, status_code=status.HTTP_201_CREATED)
async def create_resource(
    data: schemas.ResourceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    resource = models.Resource(**data.model_dump(), owner=current_user)
    db.add(resource)
    await db.commit()
    # no refresh needed: expire_on_commit=False keeps owner and created_at available
    return resource


@router.put("/{resource_id}", response_model=schemas.ResourceOut)
async def update_resource(
    resource_id: int,
    data: schemas.ResourceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    resource = await get_resource_or_404(resource_id, db)
    if resource.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own resources")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(resource, field, value)

    await db.commit()
    return resource


@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resource(
    resource_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    resource = await get_resource_or_404(resource_id, db)
    if resource.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own resources")

    await db.delete(resource)
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)