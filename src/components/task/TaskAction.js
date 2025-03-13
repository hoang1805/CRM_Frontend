import api from '../../utils/Axios';
import drawer from '../../utils/Drawer';
import flash from '../../utils/Flash';
import loading from '../../utils/Loading';
import popup from '../../utils/popup/Popup';
import Response from '../../utils/ap/Response';
import TaskDrawerForm from './TaskDrawerForm';
import AP from '../../utils/ap';

const TaskAction = {
    edit: ({ task, navigate }) => {
        drawer.showForm({
            title: 'Cập nhật công việc',
            url: `/api/task/edit/${task.id}`,
            callback: () => {
                flash.success('Cập nhật thành công!');
                navigate(0);
            },
            width: 718,
            submit: 'Cập nhật',
            content: <TaskDrawerForm value={task} />,
        });
    },

    duplicate: async ({ task, navigate }) => {
        try {
            loading.show();
            await api.post(`/api/task/duplicate/${task.id}`);
            flash.success('Sao chép thành công!');
            navigate(0);
        } catch (err) {
            AP.response.error.show(err, "Sao chép thất bại!");
        } finally {
            loading.hide();
        }
    },

    setStart: async ({ task, navigate }) => {
        try {
            loading.show();
            await api.post(`/api/task/start/${task.id}`);
            flash.success('Thay đổi trạng thái thành công');
            navigate(0);
        } catch (e) {
            AP.response.error.show(e, 'Thay đổi trạng thái thất bại');
        } finally {
            loading.hide();
        }
    },

    requestApproval: async ({ task, navigate }) => {
        try {
            loading.show();
            await api.post(`/api/task/request.approval/${task.id}`);
            flash.success('Thay đổi trạng thái thành công');
            navigate(0);
        } catch (e) {
            AP.response.error.show(e, 'Thay đổi trạng thái thất bại');
        } finally {
            loading.hide();
        }
    },
};

export default TaskAction;
