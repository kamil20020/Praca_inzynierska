import { Box, Button, Grid, OutlinedInput, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Link, Outlet, useNavigate } from "react-router-dom";
import KeycloakService from "../../keycloak/KeycloakService";
import { useEffect } from "react";
import React from "react";
import UserAPIService from "../../services/UserAPIService";

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Nr.',
        flex: 1,
        headerAlign: 'center',
        align: 'center'
    },
    { 
        field: 'username', 
        headerName: 'Nazwa użytkownika',
        flex: 2,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'nickname',
        headerName: 'Pseudonim',
        flex: 2,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'fullName',
        headerName: 'Imię i nazwisko',
        flex: 2,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params: GridRenderCellParams) => {
            return <div>{params.row.firstname} {params.row.surname}</div>
        }
    }
]

export interface UserInfo {
    id: number,         // array index
    userAccountId: string,
    username: string,
    nickname: string,
    firstname: string,
    surname: string
};

const SearchUsers = () => {

    const navigate = useNavigate()

    const [username, setUsername] = React.useState<string>('');
    const [usersData, setUsersData] = React.useState<UserInfo[]>([])

    useEffect(() => {

    })

    const handleSearch = () => {
        let newUsersData: UserInfo[] = []

        KeycloakService.searchUserAccountByUsername(username)
        .then((userAccounts) => {
            (userAccounts as Array<any>).forEach((u: any) => {
                UserAPIService.getUserByUserAccountId(u.id)
                .then((response) => {
                    const userData = response.data
                    newUsersData.push({
                        id: newUsersData.length+1,
                        userAccountId: u.id,
                        username: u.username,
                        nickname: userData.nickname,
                        firstname: userData.firstname,
                        surname: userData.surname
                    })

                    if(newUsersData.length == (userAccounts as Array<any>).length){
                        setUsersData(newUsersData)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
            })
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <Grid item xs={12} container alignItems="center" justifyContent="center">
            <Grid item xs={12}>
                <Typography textAlign="center" variant="h4" sx={{marginTop: 2}}>
                    Wyszukiwanie użytkowników
                </Typography>
            </Grid>
            <Grid item xs={5} container direction="row" alignItems="stretch" justifyContent="center">
                <Grid item xs={4} container alignItems="center" justifyContent="end">
                    <Typography 
                        textAlign="left" 
                        variant="h6"
                    >
                        Nazwa użytkownika
                    </Typography>
                </Grid>
                <Grid item xs={4} container justifyContent="center">
                    <OutlinedInput
                        id="username" 
                        color="secondary"
                        value={username}
                        onChange={(event: any) => setUsername(event.target.value)}
                       
                    />
                </Grid>
                <Grid item xs={4} container alignItems="center" justifyContent="start">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSearch}
                    >
                        Szukaj
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="center">
                <Box sx={{ height: 440, width: '66%' }}>
                    <DataGrid
                        rows={usersData}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        onSelectionModelChange={(id) => {
                            navigate(`user/${usersData[+id-1].userAccountId}`)
                        }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
}

<Link to="user/2" className="nice-link">
    Zarządzanie użytkownikiem
</Link>

export default SearchUsers;