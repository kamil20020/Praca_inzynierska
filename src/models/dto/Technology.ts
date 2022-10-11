import { TechnologyCategory } from "./TechnologyCategory";

export interface Technology {
    id: number,
    name: string,
    description: string,
    creationDateTime: Date,
    modificationDate: Date,
    provider?: string,
    icon?: string,
    firstReleaseDateTime: Date,
    lastReleaseDateTime: Date,
    technologyCategoryDTO: TechnologyCategory
}