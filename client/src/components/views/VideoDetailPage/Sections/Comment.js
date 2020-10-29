import React, {useState} from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {
    const videoId = props.postId;
    const user = useSelector(state => state.user);
    const [CommentValue, setCommentValue] = useState("")

    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: videoId
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success) {
                props.refreshFunction(response.data.result)
                setCommentValue("")
            }else {
                alert('댓글 저장 실패')
            }
        })
    }

    return (
        <div>
            <br />
            <p> 댓글 </p>
            <hr />

            {/* Comment Lists */}

            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment key={comment._id}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} commentLists={props.commentLists} postId={videoId} />
                    </React.Fragment>
                )

            ))}

            {/* Root Comment Form */}

            <form style={{ display: 'flex'}} onSubmit={onSubmit} >
                <textarea 
                    style={{ width: '100%', borderRadius:'5px' }}
                    onChange={handleClick}
                    value={CommentValue}
                    placeholder="댓글 작성"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} > 제출</button>

                
            </form>
        </div>
    )
}

export default Comment
