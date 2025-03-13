const ActionManager = () => {
    const actions = [];

    const register = ({ label = "Unnamed", onClick = () => {}, key = Date.now(), acl = true, enable_display = true } = {}) => {
        if (typeof onClick !== "function") {
            throw new Error("onClick must be a function");
        }

        if (!acl && !enable_display) {
            return;
        }

        actions.push({
            label,
            onClick: acl ? onClick : () => {},
            key,
            disabled: !acl,
        });
    };

    const registerMultiple = (registers) => {
        registers.forEach(register);
    }

    const get = () => actions;

    return { register, registerMultiple, get };
};

export default ActionManager;
