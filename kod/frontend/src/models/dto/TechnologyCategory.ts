﻿export interface TechnologyCategory{
    id: number,
    name: string,
    parentTechnologyCategoryDTO: TechnologyCategory
}