import React from 'react';
import InlineForm from '../form/InlineForm';
import InputRating from '../form/inputs/InputRating';
import InputTextarea from '../form/inputs/InputTextarea';

const FeedbackForm = ({ callback, token }) => {
    return (
        <InlineForm
            className="feedback-form"
            callback={callback}
            submit={'Gửi đánh giá'}
            url={`/api/public/feedback/${token}`}
        >
            <InputRating label='Đánh giá của bạn *' name='rating' />
            <InputTextarea label='Mô tả đánh giá' name='content'/>
        </InlineForm>
    );
};

export default FeedbackForm;
