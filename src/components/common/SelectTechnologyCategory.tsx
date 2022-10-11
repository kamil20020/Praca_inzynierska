import { Grid, TextField } from "@mui/material"
import React, { useEffect } from "react"
import ComplexTechnologyCategory from "../../models/dto/ComplexTechnologyCatgory"
import TechnologyCategoryAPIService from "../../services/TechnologyCategoryAPIService"
import TreeView, { NodeData } from "./TreeView"
import XCloeasableDialog from "./XCloeasableDialog"

interface SelectedTechnologyCategoryProps {
    id: number,
    name: string
}

interface SelectTechnologyCategoryProps {
    onSelect: (id: number) => void
}

const SelectTechnologyCategory = (props: SelectTechnologyCategoryProps) => {

    const [selectedTechnologyCategory, setSelectedTechnologyCategory] = React.useState<SelectedTechnologyCategoryProps | null>(null)

    const [technologyCategories, setTechnologyCategories] = React.useState<ComplexTechnologyCategory[]>([])

    const [close, setClose] = React.useState<boolean>(true)

    useEffect(() => {
        TechnologyCategoryAPIService.getTreeOfTechnologyCategories()
        .then((response) => {
            setTechnologyCategories(response.data)
        })
    }, [])

    const handleSelectTechnologyCategory = (id: number, name: string) => {
        setClose(true)
        setSelectedTechnologyCategory({id: id, name: name})
        props.onSelect(id)
    }

    return (
        <Grid item xs={12} container>
            <Grid item xs={6} container justifyContent="end">
                <TextField
                    id="username" 
                    disabled
                    fullWidth
                    color="secondary"
                    value={selectedTechnologyCategory ? selectedTechnologyCategory.name : ''}
                />
            </Grid>
            <Grid item xs={6} container justifyContent="end">
                <XCloeasableDialog
                    title="Wybór kategorii technologii"
                    size="md"
                    close = {close}
                    setClose = {setClose}
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
        </Grid>
    )
}

export default SelectTechnologyCategory;