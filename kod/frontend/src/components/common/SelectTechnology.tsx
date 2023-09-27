import { Grid, Typography, FormControl, Select, SelectChangeEvent, MenuItem, FormHelperText } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { Technology } from "../../models/dto/Technology";
import TechnologyAPIService from "../../services/TechnologyAPIService";

export interface SelectTechnologyProps {
    selectedTechnologyCategoryId?: number,
    onSelect: (id: number) => void
}

const SelectTechnology = (props: SelectTechnologyProps) => {

    const [technologies, setTechnologies] = React.useState<Technology[]>([]);
    const [selectedTechnologyId, setSelectedTechnologyId] = React.useState<number>(-1);

    useEffect(() => {
        if(props.selectedTechnologyCategoryId){
            TechnologyAPIService.getAllByTechnologyCategoryId(props.selectedTechnologyCategoryId)
            .then((response) => {
                setTechnologies(response.data)
            })
        }
        else{
            TechnologyAPIService.getAll()
            .then((response) => {
                setTechnologies(response.data)
            })
        }
    }, [props.selectedTechnologyCategoryId])

    return (
        <Grid item xs={12} container marginTop={1}>
            <Grid item xs={6}>
                <Typography textAlign="start" variant="h6">Technologia</Typography>
            </Grid>
            <Grid item xs={6}>
                <Select
                    labelId="select-technology-label"
                    id="select-technology"
                    fullWidth
                    value={selectedTechnologyId !== -1 ? selectedTechnologyId.toString() : ''}
                    color="secondary"
                    onChange={(event: SelectChangeEvent) => {
                        const newSelectedTechnologyId = +event.target.value
                        setSelectedTechnologyId(newSelectedTechnologyId)
                        props.onSelect(newSelectedTechnologyId)
                    }}
                >
                    {technologies.map((t: Technology, index: number) => (
                        <MenuItem key={index} value={t.id}>{t.name}</MenuItem>
                    ))}
                </Select>
            </Grid>
        </Grid>
    );
}

export default SelectTechnology;