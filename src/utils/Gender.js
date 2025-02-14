const genders = [
    {id: 'MALE', label: 'Nam'},
    {id: 'FEMALE', label: 'Nữ'},
    {id: 'OTHER', label: 'Khác'},
];

const Gender = {
    fromContext(id) {
        return genders.find(gender => gender.id === id);
    },
    getGenders(){
        return genders;
    }
};

export default Gender;