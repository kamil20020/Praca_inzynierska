import { Grid, TextField, Typography } from "@mui/material"
import React, { useEffect } from "react"
import ComplexTechnologyCategory from "../../models/dto/ComplexTechnologyCatgory"
import { TechnologyCategory } from "../../models/dto/TechnologyCategory"
import TechnologyCategoryAPIService from "../../services/TechnologyCategoryAPIService"
import FormElement from "./FormElement"
import TreeView, { NodeData } from "./TreeView"
import XCloeasableDialog from "./XCloeasableDialog"

interface SelectedTechnologyCategoryProps {
    id: number,
    name: string
}

interface SelectTechnologyCategoryProps {
    technologyCategoryId?: number,
    onSelect: (id: number) => void
}

const SelectTechnologyCategory = (props: SelectTechnologyCategoryProps) => {

    const [selectedTechnologyCategory, setSelectedTechnologyCategory] = React.useState<SelectedTechnologyCategoryProps | null>(null)

    const [technologyCategories, setTechnologyCategories] = React.useState<ComplexTechnologyCategory[]>([])

    const [open, setOpen] = React.useState<boolean>(false)

    useEffect(() => {
        TechnologyCategoryAPIService.getTreeOfTechnologyCategories()
        .then((response) => {
            setTechnologyCategories(response.data)
        })
    }, [])

    useEffect(() => {

        if(!props.technologyCategoryId || props.technologyCategoryId == -1)
            return;

        const initialTechnologyCategoryId = props.technologyCategoryId as number

        TechnologyCategoryAPIService.getTechnologyCategoryById(initialTechnologyCategoryId)
        .then((response) => {
            const initialTechnologyCategory = response.data
            setSelectedTechnologyCategory({
                id: initialTechnologyCategory.id, 
                name: initialTechnologyCategory.name
            })
            props.onSelect(initialTechnologyCategoryId)
        })
    }, [props.technologyCategoryId])

    const handleSelectTechnologyCategory = (id: number, name: string) => {
        setOpen(false)
        setSelectedTechnologyCategory({id: id, name: name})
        props.onSelect(id)
    }

    return (
        <Grid item xs={12} container alignItems="center">
            <Grid item xs={6}>
                <Typography 
                    textAlign="start" 
                    variant="h6"
                >
                    Wybierz kategorię technologii
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    id="technology-category-name"
                    fullWidth
                    color="secondary"
                    value={selectedTechnologyCategory ? selectedTechnologyCategory.name : ''}
                    onClick={() => setOpen(true)}
                />
            </Grid>
            <XCloeasableDialog
                title="Wybór kategorii technologii"
                size="sm"
                open = {open}
                showButton={false}
                form = {
                    <Grid container justifyContent="center">
                        <TreeView 
                            children={technologyCategories as unknown as NodeData[]}
                            childrenNames={"childrenTechnologyCategoryDTOList"}
                            handleSelectItem={handleSelectTechnologyCategory}
                        />
                    </Grid>
                }
            />
        </Grid>
    )
}

export default SelectTechnologyCategory;