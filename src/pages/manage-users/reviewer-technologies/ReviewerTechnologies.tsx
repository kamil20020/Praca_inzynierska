import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Technology } from "../../../models/Technology";
import { TechnologyExpert } from "../../../models/TechnologyExpert";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../../redux/slices/notificationSlice";
import TechnologyExpertAPIService from "../../../services/TechnologyExpertAPIService";
import { ManageUserChildProps } from "../ManageUser";
import AddReviewerTechnology from "./AddReviewerTechnology";

export interface ReviewerTechnologiesProps {
    userId: number
}

const ReviewerTechnologies = (props: ReviewerTechnologiesProps) => {

    const dispatch = useDispatch();
    const [technologyName, setTechnologyName] = React.useState('');
    const [data, setData] = React.useState<TechnologyExpert[]>([]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    useEffect(() => {
        handleSearchTechnologyExperts('')
    }, [])

    const handleSearchTechnologyExperts = (technologyName: string) => {
        TechnologyExpertAPIService.getAllByUserIdAndContainingTechnologyName(props.userId, technologyName)
        .then((response) => {
            setData(response.data)
        })
    }

    const handleChangeTechnologyName = (technologyName: string) => {
        setTechnologyName(technologyName)
        handleSearchTechnologyExperts(technologyName)
    }

    const handleDeleteTechnologyExpert = (technologyExpertId: number) => {
        TechnologyExpertAPIService.deleteById(technologyExpertId)
        .then(() => {
            dispatch(setNotificationMessage('Pomyślnie usunięto przypisanie technologii'))
            dispatch(setNotificationType('success'))
            dispatch(setNotificationStatus(true))
            setData(
                data.filter((t: TechnologyExpert) => t.id !== technologyExpertId)
            )
        })
        .catch((error) => {
            dispatch(setNotificationMessage(error.message))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
        })
    }

    const handleUpdateTechnology = (newTechnology: TechnologyExpert) => {
        setData([...data, newTechnology])
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <React.Fragment>
             <Grid item xs={5.5} container alignItems="stretch" justifyContent="center" direction="column">
                <Grid item xs={12}>
                    <Typography textAlign="center" variant="h5" sx={{marginBottom: 5}}>
                        Znane przez użytkownika technologie
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">
                                            <AddReviewerTechnology userId={props.userId} onSave={handleUpdateTechnology} data={data}/>
                                        </TableCell>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right">Wyszukaj</TableCell>
                                        <TableCell align="left">
                                            <TextField
                                                id="search"
                                                placeholder="Nazwa technologii"
                                                color="secondary"
                                                value={technologyName}
                                                onChange={(event: any) => handleChangeTechnologyName(event.target.value)} 
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {data
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row: TechnologyExpert, index: number) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{row.technologyDTO.name}</TableCell>
                                            <TableCell align="center">{row.technologyDTO.technologyCategoryDTO.name}</TableCell>
                                            <TableCell align="center">{row.technologyDTO.provider}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleDeleteTechnologyExpert(row.id)}
                                                >
                                                    Usuń
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 25, 100]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default ReviewerTechnologies;