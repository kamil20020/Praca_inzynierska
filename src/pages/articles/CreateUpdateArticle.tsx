import { Button, FormControl, FormHelperText, FormLabel, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Typography } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FormElement from "../../components/common/FormElement";
import SelectTechnologyCategory from "../../components/common/SelectTechnologyCategory";
import Article from "../../models/dto/Article";
import { Technology } from "../../models/dto/Technology";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../redux/slices/notificationSlice";
import ArticleAPIService from "../../services/ArticleAPIService";
import TechnologyAPIService from "../../services/TechnologyAPIService";

interface FormProps {
    title: string,
    content: string,
    selectedTechnologyCategoryId?: number,
    selectedTechnologyId: number
}

interface ErrorProps {
    title: string,
    selectedTechnologyId: string
}

const CreateUpdateArticle = () => {

    const articleId = useParams().articleId

    const [availableTechnologies, setAvailableTechnologies] = React.useState<Technology[]>([]);
    const [form, setForm] = React.useState<FormProps>({
        title: '',
        content: '',
        selectedTechnologyCategoryId: -1,
        selectedTechnologyId: -1
    })
    const [errors, setErrors] = React.useState<ErrorProps>({
        title: '',
        selectedTechnologyId: ''
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isGivenArticleId = () => (
        articleId !== 'null'
    )

    const onFieldChange = (field: string, event: any) => {
        setForm({...form, [field]: event.target.value})
        setErrors({...errors, [field]: ''})
    }

    useEffect(() => {
        if(!isGivenArticleId())
            return;

        ArticleAPIService.getById(articleId as string)
        .then((response) => {
            const article: Article = response.data
            setForm({
                title: article.title,
                content: article.content,
                selectedTechnologyCategoryId: article.technologyDTO.technologyCategoryDTO.id,
                selectedTechnologyId: article.technologyDTO.id
            })
        })
        .catch((error) => {
            dispatch(setNotificationMessage(error.response.data))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
            navigate("../")
        })
    }, [])

    useEffect(() => {
        if(form.selectedTechnologyCategoryId == -1){
            TechnologyAPIService.getAll()
            .then((response) => {
                setAvailableTechnologies(response.data)
            })
        }
        else{
            TechnologyAPIService.getAllByTechnologyCategoryId(form.selectedTechnologyCategoryId as number)
            .then((response) => {
                setAvailableTechnologies(response.data)
            })
        }
    }, [form.selectedTechnologyCategoryId])

    return (
        <Grid item xs={12} container alignItems="start" justifyContent="center">
            <Grid item xs={12} container justifyContent="center" sx={{marginTop: 7}}>
                <Typography textAlign="center" variant="h4" sx={{marginRight: 5}}>
                    {isGivenArticleId() ? "Aktualizowanie artykułu" : "Tworzenie artykułu"}
                </Typography>
            </Grid>
            <Grid item xs={11} container justifyContent="center">
                <Grid item xs={3} container justifyContent="stretch" spacing={4} marginTop={3} marginBottom={4}>
                    <Grid item xs={12} container>
                        <Grid item xs={6} marginTop={1.6}>
                            <Typography textAlign="start" variant="h6">
                                Tytuł
                            </Typography>
                        </Grid>
                        <Grid item xs={6} container alignItems="center">
                            <FormControl fullWidth>
                                <OutlinedInput
                                    id="title" 
                                    color="secondary"
                                    value={form.title}
                                    error={errors.title != ''}
                                    onChange={(event: any) => onFieldChange('title', event)} 
                                />
                                <FormHelperText error>{errors.title + ' '}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <SelectTechnologyCategory onSelect={(id: number) => setForm({...form, selectedTechnologyCategoryId: id})}/>
                    <Grid item xs={12} container marginTop={3}>
                        <Grid item xs={6} marginTop={1.6}>
                            <Typography textAlign="start" variant="h6">Technologia</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <Select
                                    labelId="select-technology-label"
                                    id="select-technology"
                                    value={form.selectedTechnologyId !== -1 ? form.selectedTechnologyId.toString() : ''}
                                    error={errors.selectedTechnologyId != ''}
                                    color="secondary"
                                    onChange={(event: SelectChangeEvent) => onFieldChange('selectedTechnologyId', event)}
                                >
                                    {availableTechnologies.map((t: Technology, index: number) => (
                                        <MenuItem key={index} value={t.id}>{t.name}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText error>{errors.selectedTechnologyId + ' '}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Editor
                        init={{
                            menubar: true,
                            height: 800,
                            plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
                            'searchreplace', 'fullscreen', 'insertdatetime', 'media', 'table', 'help',
                            'codesample'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                            'bold italic backcolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help | codesample',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                            codesample_languages: [
                                { text: 'HTML/XML', value: 'markup' },
                                { text: 'JavaScript', value: 'javascript' },
                                { text: 'CSS', value: 'css' },
                                { text: 'PHP', value: 'php' },
                                { text: 'Ruby', value: 'ruby' },
                                { text: 'Python', value: 'python' },
                                { text: 'Java', value: 'java' },
                                { text: 'C', value: 'c' },
                                { text: 'C#', value: 'csharp' },
                                { text: 'C++', value: 'cpp' }
                            ],
                        }}
                        value={form.content}
                        onEditorChange={(content: string) => setForm({...form, content: content})}
                    />
                </Grid>
                <Grid item marginTop={4} marginBottom={3}>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{marginRight: 4}}
                    >
                        Zapisz
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate(`../details/${articleId}`)}
                    >
                        Anuluj
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default CreateUpdateArticle;