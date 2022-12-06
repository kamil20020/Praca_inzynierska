import { Button, Grid, IconButton, Menu, MenuItem, Rating, Tooltip, Typography } from "@mui/material"
import React from "react";
import { useDispatch, useSelector } from "react-redux";
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
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";
import CreateUpdateOpinion from "./CreateUpdateOpinion";
import OpinionAPIService from "../../../services/OpinionAPIService";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../../redux/slices/notificationSlice";

export interface OpinionViewProps {
    opinion: Opinion,
    index: number,
    editOpinion: (opinion: Opinion, index: number) => void,
    removeOpinion: (index: number) => void
}

const OpinionView = (props: OpinionViewProps) => {

    const userId = useSelector((state: RootState) => state.user).user.id as number

    const opinion = props.opinion
    const author = opinion.author

    const actualRoles = useSelector((state: RootState) => state.keycloak).roles
    const [anchorElOpinionOptions, setAnchorElOpinionOptions] = React.useState<null | HTMLElement>(null);
    const [isEditMode, setIsEditMode] = React.useState<boolean>(false);
    const [openDeletionConfirmation, setOpenDeletionConfirmation] = React.useState<boolean>(false);
    const dispatch = useDispatch()

    const handleOpenOpinionOptions = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElOpinionOptions(event.currentTarget)
    }

    const handleCloseOpinionOptions = () => {
        setAnchorElOpinionOptions(null)
    }

    const handleOpinionAction = (isEditMode: boolean) => {
        handleCloseOpinionOptions()
        setIsEditMode(isEditMode)
    }

    const handleCancelDeleteOpinion = () => {

        handleCloseOpinionOptions()
        setOpenDeletionConfirmation(false)
    }

    const handleShowDeleteOpinion = () => {
        
        handleCloseOpinionOptions()
        setOpenDeletionConfirmation(true)
    }

    const handleDeleteOpinion = () => {

        OpinionAPIService.deleteById(opinion.id)
        .then((response) => {
            dispatch(setNotificationMessage("Opinia została usunięta"))
            dispatch(setNotificationType('success'))
            dispatch(setNotificationStatus(true))
            props.removeOpinion(props.index)
        })
        .catch((error) => {
            dispatch(setNotificationMessage(error.response.data))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
        })
    }

    const renderAcceptances = () => {
        switch(opinion.loggedUserAcceptance){
            case 1:
                return (
                    <React.Fragment>
                        <IconButton>
                            <ThumbUpAltIcon htmlColor="black"/>
                        </IconButton>
                        <IconButton>
                            <ThumbDownOffAltIcon htmlColor="black"/>
                        </IconButton>
                        <IconButton>
                            <CloseIcon color="secondary"/>
                        </IconButton>
                    </React.Fragment>
                )
                break
            case -1:
                return (
                    <React.Fragment>
                        <IconButton>
                            <ThumbUpOffAltIcon htmlColor="black"/>
                        </IconButton>
                        <IconButton color="secondary">
                            <ThumbDownAltIcon htmlColor="black"/>
                        </IconButton>
                        <IconButton>
                            <CloseIcon color="secondary"/>
                        </IconButton>
                    </React.Fragment>
                )
                break
            default:
                return (
                    <React.Fragment>
                        <IconButton>
                            <ThumbUpOffAltIcon htmlColor="black"/>
                        </IconButton>
                        <IconButton>
                            <ThumbDownOffAltIcon htmlColor="black"/>
                        </IconButton>
                        <IconButton>
                            <CloseIcon color="secondary"/>
                        </IconButton>
                    </React.Fragment>
                )
        }
    }

    return (
        <Grid item container spacing={2}>
            <Grid item xs={6} container alignItems="center" justifyContent="space-between">
                <CustomAvatar file={author.avatar}/>
                <Typography textAlign="center" variant="h6">
                    {author.nickname}
                </Typography>
                <Typography textAlign="center" variant="h6">
                    {new Date(opinion.creationDate).toLocaleString()}
                </Typography>
                {((actualRoles.includes(roles.logged_user.name) && userId == opinion.author.id) || actualRoles.includes(roles.administrator.name)) &&
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
                            <MenuItem onClick={() => handleOpinionAction(true)}>Edytuj</MenuItem>
                            <MenuItem onClick={() => handleShowDeleteOpinion()}>Usuń</MenuItem>
                        </Menu>
                    </React.Fragment>
                }
            </Grid>
            {!isEditMode ?
                    <React.Fragment>
                        <Grid item xs={12}>
                            <Rating size="large" max={5} value={opinion.rating} precision={0.1} disabled sx={{opacity: 1, marginTop: 2}}/>
                        </Grid>
                        <Grid item xs={12} marginLeft={2}>
                            <Typography>{opinion.content}</Typography>
                        </Grid>
                        {actualRoles.includes(roles.logged_user.name) &&
                            <Grid item container columnSpacing={1} marginLeft={1} marginTop={0.2}>
                                {renderAcceptances()}
                            </Grid>
                        }
                    </React.Fragment>
                :
                    <CreateUpdateOpinion 
                        articleId={opinion.articleId}
                        opinion={opinion}
                        onCancel={() => handleOpinionAction(false)}
                        editOpinion={(opinion: Opinion) => props.editOpinion(opinion, props.index)}
                    />
            }
            <ConfirmationDialog
                title="Czy napewno ta opinia powinna zostać usunięta?"
                open={openDeletionConfirmation}
                onAccept={handleDeleteOpinion} 
                onCancel={handleCancelDeleteOpinion}
            />
        </Grid>
    )
}

export default OpinionView;