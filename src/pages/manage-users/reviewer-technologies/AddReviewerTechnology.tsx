import { Grid, FormControl, TextField, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, Box, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import SelectTechnologyCategory from "../../../components/common/SelectTechnologyCategory";
import TreeView, { NodeData } from "../../../components/common/TreeView";
import XCloeasableDialog from "../../../components/common/XCloeasableDialog";
import ComplexTechnologyCategory from "../../../models/dto/ComplexTechnologyCatgory";
import { Technology } from "../../../models/dto/Technology";
import { TechnologyCategory } from "../../../models/dto/TechnologyCategory";
import { TechnologyExpert } from "../../../models/TechnologyExpert";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../../redux/slices/notificationSlice";
import TechnologyAPIService from "../../../services/TechnologyAPIService";
import TechnologyCategoryAPIService from "../../../services/TechnologyCategoryAPIService";
import TechnologyExpertAPIService from "../../../services/TechnologyExpertAPIService";

export interface AddReviewerTechnologyProps {
    userId: number,
    onSave: (newTechnology: TechnologyExpert) => void,
    data: TechnologyExpert[]
}

const AddReviewerTechnology = (props: AddReviewerTechnologyProps) => {

    const [selectedTechnologyId, setSelectedTechnologyId] = React.useState<number>(-1);
    const [selectedTechnologyCategoryId, setSelectedTechnologyCategoryId] = React.useState<number>(-1);
    const [availableTechnologies, setAvailableTechnologies] = React.useState<Technology[]>([]);
    const [close, setClose] = React.useState<boolean>(true)
    const dispatch = useDispatch()

    useEffect(() => {
        if(selectedTechnologyCategoryId == -1){
            TechnologyExpertAPIService.getAllTechnologiesWhichUserHasnt(props.userId)
            .then((response) => {
                setAvailableTechnologies(response.data)
            })
        }
        else{
            TechnologyExpertAPIService.getAllTechnologiesByTechnologyCategoryIdWhichUserHasnt(props.userId, selectedTechnologyCategoryId)
            .then((response) => {
                setAvailableTechnologies(response.data)
            })
        }
    }, [selectedTechnologyCategoryId])

    const handleSave = () => {
        TechnologyExpertAPIService.create(props.userId, selectedTechnologyId)
        .then((response) => {
            setAvailableTechnologies(availableTechnologies.filter((t: Technology) => t.id != selectedTechnologyId))
            setSelectedTechnologyCategoryId(-1)
            setSelectedTechnologyId(-1)
            props.onSave(response.data)
            dispatch(setNotificationMessage("Pomyślnie przypisano technologię"))
            dispatch(setNotificationType('success'))
            dispatch(setNotificationStatus(true))
        })
        .catch((error) => {
            dispatch(setNotificationMessage(error.message))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
        })
    }

    return (
        <XCloeasableDialog 
            title="Przypisywanie technologii"
            buttonTitle="Dodaj"
            close = {close}
            setClose = {setClose}
            form = {
                <Grid 
                    container 
                    spacing={6}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Grid item xs={10} container alignItems="stretch" justifyContent="center" sx={{marginTop: 4}}>
                        <SelectTechnologyCategory onSelect={setSelectedTechnologyCategoryId}/>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="select-technology-label" color="secondary">Technologia</InputLabel>
                            <Select
                                labelId="select-technology-label"
                                id="select-technology"
                                value={selectedTechnologyId !== -1 ? selectedTechnologyId.toString() : ''}
                                color="secondary"
                                label="Age"
                                onChange={(event: SelectChangeEvent) => setSelectedTechnologyId(+event.target.value)}
                            >
                                {availableTechnologies.map((t: Technology, index: number) => (
                                    <MenuItem key={index} value={t.id}>{t.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} container justifyContent="center" sx={{marginTop: 2}}>
                        <Grid item xs={4} container justifyContent="center">
                            <Grid item xs={6} container justifyContent="center">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleSave}
                                >
                                    Zapisz
                                </Button>
                            </Grid>
                            <Grid item xs={6} container justifyContent="center">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => setClose(true)}
                                >
                                    Anuluj
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
        />
    );
}

export default AddReviewerTechnology;