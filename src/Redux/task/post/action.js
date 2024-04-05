//login
export const POST_TASK_LOADING = "POST_TASK_LOADING"
export const POST_TASK_SUCCESS = "POST_TASK_SUCCESS"
export const POST_TASK_ERROR = "POST_TASK_ERROR"

//login

const postTaskloading = () => ({
    type: POST_TASK_LOADING
})
const postTaskSuccess = (payload) => ({
    type: POST_TASK_SUCCESS,
    payload
})
const postTaskError = (payload) => ({
    type: POST_TASK_ERROR,
    payload
})




export const postTaskAction = (payload) => (dispatch) => {
    dispatch(postTaskloading())
    let todoData = JSON.parse(localStorage.getItem('TodoData')) || [];
    todoData.push(payload);
    localStorage.setItem('TodoData', JSON.stringify(todoData));
    dispatch(postTaskSuccess(payload));
}
