import ActionManager from "../../utils/ActionManager";

const Task = {
    getActions: ({task, user, account}) => {
        const am = ActionManager();

        return am.get();
    }
}

export default Task;