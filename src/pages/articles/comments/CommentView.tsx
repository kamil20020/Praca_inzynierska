import { Button, Grid, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import React, { useEffect } from "react";
import CustomAvatar from "../../../components/common/CustomAvatar";
import Comment from "../../../models/dto/Comment";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateUpdateComment from "./CreateUpdateComment";
import { useDispatch, useSelector } from "react-redux";
import { roles } from "../../../keycloak/KeycloakService";
import { RootState } from "../../../redux/store";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CommentAPIService from "../../../services/CommentAPIService";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../../redux/slices/notificationSlice";

export interface CommentViewProps {
    comment: Comment,
    index: number,
    editSubComment: (comment: Comment, index: number) => void,
    removeSubComment: (index: number) => void
}

enum Modes{
    viewMode,
    editMode,
    creationMode
}

const CommentView = (props: CommentViewProps) => {

    const comment = props.comment
    const author = comment.authorDTO

    const actualRoles = useSelector((state: RootState) => state.keycloak).roles
    const [subComments, setSubComments] = React.useState<Comment[]>([]);
    const [anchorElCommentOptions, setAnchorElCommentOptions] = React.useState<null | HTMLElement>(null);
    const [mode, setMode] = React.useState<Modes>(Modes.viewMode);
    const pageSize: number = 6;
    const [page, setPage] = React.useState<number>(0);
    const [numberOfSubComments, setNumberOfSubComments] = React.useState<number>(0);
    const [openSubComments, setOpenSubComments] = React.useState<boolean>(false);
    const [openDeletionConfirmation, setOpenDeletionConfirmation] = React.useState<boolean>(false);
    const dispatch = useDispatch()

    useEffect(() => {
        CommentAPIService.getSubComments(props.comment.id, {size: pageSize, page: page})
        .then((response) => {
            setSubComments(response.data.content)
            setNumberOfSubComments(response.data.totalElements)
        })
    }, [])

    const handleOpenCommentOptions = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElCommentOptions(event.currentTarget)
    }

    const handleCloseCommentOptions = () => {
        setAnchorElCommentOptions(null)
    }

    const handleCommentAction = (mode: Modes) => {
        handleCloseCommentOptions()
        setMode(mode)
    }

    const handleMode = () => {
        switch(mode){
            case Modes.viewMode: 
                return <React.Fragment>
                    <Typography>{comment.content}</Typography>
                    {actualRoles.includes(roles.logged_user.name) &&
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{marginTop: 2}}
                            onClick={() => handleCommentAction(Modes.creationMode)}
                        >
                            Dodaj komentarz
                        </Button>
                    }
                </React.Fragment> 
            case Modes.editMode: 
                return <CreateUpdateComment
                    articleId={props.comment.articleId}
                    parentCommentId={props.comment.id}
                    comment={props.comment}
                    index={props.index}
                    onCancel={() => handleCommentAction(Modes.viewMode)}
                    editSubComment={props.editSubComment} //(newComment: Comment) => setSubComments([newComment, ...subComments])
                /> 
            case Modes.creationMode: 
                return <React.Fragment>
                    <Typography marginBottom={2}>{comment.content}</Typography>
                    <CreateUpdateComment
                        articleId={props.comment.articleId}
                        parentCommentId={props.comment.id}
                        onCancel={() => handleCommentAction(Modes.viewMode)}
                        createSubComment={handleAddSubComment}
                    /> 
                </React.Fragment>
        }
    }

    const handleAddSubComment = (newComment: Comment) => {
        setSubComments([newComment, ...subComments])
        setNumberOfSubComments(subComments.length+1)
    }

    const newEditSubComment = (comment: Comment, index: number = -1) => {
        if(index === -1){
            const updatedComments: Comment[] = [comment, ...subComments]
            setSubComments(updatedComments)
            setNumberOfSubComments(updatedComments.length)
        }
        else{
            let updatedComments: Comment[] = [...subComments]
            updatedComments[index] = comment
            setSubComments(updatedComments)
        }
    }

    const newRemoveSubComment = (index: number) => {
        let updatedComments: Comment[] = [...subComments]
        updatedComments.splice(index, 1)
        setSubComments(updatedComments)
        setNumberOfSubComments(numberOfSubComments-1)
    }

    const searchSubComments = () => {
        CommentAPIService.getSubComments(props.comment.id, {size: pageSize, page: page})
        .then((response) => {
            setSubComments(response.data.content)
        })
    }

    const handleDeleteComment = () => {
        CommentAPIService.deleteCommentById(props.comment.id)
        .then(() => {
            dispatch(setNotificationMessage("Komentarz został usunięty"))
            dispatch(setNotificationType('success'))
            dispatch(setNotificationStatus(true))
            props.removeSubComment(props.index)
            handleCloseCommentOptions()
            setOpenDeletionConfirmation(false)
        })
        .catch((error) => {
            dispatch(setNotificationMessage(error.response.data))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
            handleCloseCommentOptions()
            setOpenDeletionConfirmation(false)
        })
    }

    const handleCancelDeleteComment = () => {

        handleCloseCommentOptions()
        setOpenDeletionConfirmation(false)
    }

    const handleShowDeleteComment = () => {
        
        handleCloseCommentOptions()
        setOpenDeletionConfirmation(true)
    }

    return (
        <Grid item container spacing={2}>
            <Grid item xs={6} container alignItems="center" justifyContent="space-between">
                <CustomAvatar file={author.avatar}/>
                <Typography textAlign="center" variant="h6">
                    {author.nickname}
                </Typography>
                <Typography textAlign="center" variant="h6">
                    {new Date(comment.modificationDate).toLocaleString()}
                </Typography>
                {actualRoles.includes(roles.logged_user.name) &&
                    <React.Fragment>
                        <Tooltip title="Opcje komentarza">
                            <IconButton onClick={handleOpenCommentOptions} sx={{marginTop: -0.5}}>
                                <MoreVertIcon/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorElCommentOptions}
                            open={Boolean(anchorElCommentOptions)}
                            onClose={handleCloseCommentOptions}
                        >
                            <MenuItem onClick={() => handleCommentAction(Modes.editMode)}>Edytuj</MenuItem>
                            <MenuItem onClick={handleShowDeleteComment}>Usuń</MenuItem>
                        </Menu>
                    </React.Fragment>
                }
            </Grid>
            <Grid item xs={12} marginLeft={2}>
                <Grid item>
                    {handleMode()}
                </Grid>
                {numberOfSubComments !== 0 &&
                    <Grid item>
                        <Button
                            color="secondary"
                            sx={{marginTop: 2, marginLeft: -1}}
                            onClick={() => setOpenSubComments(!openSubComments)}
                        >
                            {openSubComments ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                            Odpowiedzi ({numberOfSubComments})
                        </Button>
                        <Grid item marginLeft={4} container rowSpacing={5}>
                            {openSubComments &&
                                subComments.map((c: Comment, index: number) => (
                                    <CommentView 
                                        key={c.id}
                                        comment={c}
                                        index={index}
                                        editSubComment={newEditSubComment}
                                        removeSubComment={newRemoveSubComment}
                                    />
                                ))
                            }
                        </Grid>
                    </Grid>
                }
                <ConfirmationDialog
                    title="Czy napewno ten komentarz powinien zostać usunięty?"
                    open={openDeletionConfirmation}
                    onAccept={handleDeleteComment} 
                    onCancel={handleCancelDeleteComment}
                />
            </Grid>
        </Grid>
    );
}

export default CommentView;