export default interface ComplexTechnologyCategory {
    id: number,
    name: string,
    childrenTechnologyCategoryDTOList: ComplexTechnologyCategory
}