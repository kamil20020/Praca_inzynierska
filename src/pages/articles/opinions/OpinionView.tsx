import { Grid, IconButton, Menu, MenuItem, Rating, Tooltip, Typography } from "@mui/material"
import React from "react";
import { useSelector } from "react-redux";
import CustomAvatar from "../../../components/common/CustomAvatar";
import { roles } from "../../../keycloak/KeycloakService";
import Opinion from "../../../models/dto/Opinion";
import { RootState } from "../../../redux/store";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import CloseIcon from '@mui/icons-material/Close';

export interface OpinionViewProps {
    opinion: Opinion,
    index: number,
    editOpinion: (opinion: Opinion, index: number) => void,
    removeOpinion: (index: number) => void
}

const OpinionView = (props: OpinionViewProps) => {

    const opinion = props.opinion
    const author = opinion.authorDTO

    const actualRoles = useSelector((state: RootState) => state.keycloak).roles
    const [anchorElOpinionOptions, setAnchorElOpinionOptions] = React.useState<null | HTMLElement>(null);

    const handleOpenOpinionOptions = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElOpinionOptions(event.currentTarget)
    }

    const handleCloseOpinionOptions = () => {
        setAnchorElOpinionOptions(null)
    }

    return (
        <Grid item container spacing={2}>
            <Grid item xs={12}>
                <Rating size="large" max={5} value={opinion.rating} precision={0.1} disabled sx={{opacity: 1, marginTop: 2}}/>
            </Grid>
            <Grid item xs={6} container alignItems="center" justifyContent="space-between">
                <CustomAvatar file={author.avatar}/>
                <Typography textAlign="center" variant="h6">
                    {author.nickname}
                </Typography>
                <Typography textAlign="center" variant="h6">
                    {new Date(opinion.modificationDate).toLocaleString()}
                </Typography>
                {actualRoles.includes(roles.logged_user.name) &&
                    <React.Fragment>
                        <Tooltip title="Opcje opinii">
                            <IconButton onClick={handleOpenOpinionOptions} sx={{marginTop: -0.5}}>
                                <MoreVertIcon/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorElOpinionOptions}
                            open={Boolean(anchorElOpinionOptions)}
                            onClose={handleCloseOpinionOptions}
                        >
                            <MenuItem onClick={() => console.log('Edit')}>Edytuj</MenuItem>
                            <MenuItem onClick={() => console.log('Remove')}>Usuń</MenuItem>
                        </Menu>
                    </React.Fragment>
                }
            </Grid>
            <Grid item xs={12} marginLeft={2}>
                <Typography>{opinion.content}</Typography>
            </Grid>
            {actualRoles.includes(roles.logged_user.name) &&
                <Grid item container columnSpacing={1} marginLeft={1} marginTop={0.2}>
                    <IconButton>
                        <ThumbUpAltIcon htmlColor="black"/>
                    </IconButton>
                    <IconButton>
                        <ThumbUpOffAltIcon htmlColor="black"/>
                    </IconButton>
                    <IconButton color="secondary">
                        <ThumbDownAltIcon htmlColor="black"/>
                    </IconButton>
                    <IconButton>
                        <ThumbDownOffAltIcon htmlColor="black"/>
                    </IconButton>
                    <IconButton>
                        <CloseIcon color="secondary"/>
                    </IconButton>
                </Grid>
            }
        </Grid>
    )
}

export default OpinionView;