import React, { useEffect, useState } from 'react'
import {Button, Form, Row, Col} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import {app} from '../../firebaseinit'
import { deleteDoc, doc, updateDoc,
        addDoc,collection,getFirestore,onSnapshot,orderBy,query,where } from 'firebase/firestore';

const Comments = () => {
    const [comments,setComments] = useState([]);
    const db=getFirestore(app);
    const [contents,setContents] = useState('');
    const navi = useNavigate();
    const email=sessionStorage.getItem('email');
    const {id} = useParams();

    const callAPI = () =>{
        const q = query(collection(db,'comments'),where('pid','==',id),orderBy('date','desc'));
        onSnapshot(q,snapshot=>{
            let rows=[];
            snapshot.forEach(row=>{
                rows.push({id:row.id,...row.data()});
            });
            console.log(rows);
            const data=rows.map(row=>row && {...row,ellip:true,isEdit:false,text:row.contents});
            setComments(data);
        });

    }
    useEffect(()=>{
        callAPI();
    },[]);

    const onClickContents = (id) =>{
        const data=comments.map(com=>com.id === id ? {...com,ellip:!com.ellip} : com);
        setComments(data);
    }

    const onClickInsert = () => {
        sessionStorage.setItem('target',`/bbs/read/${id}`);
        navi('/login');
    }
    const onClickDelete = async(id) => {
        if(!window.confirm(`${id}번 댓글을 삭제하실래요?`)) return;
        //댓글 삭제
        await deleteDoc(doc(db,`/comments/${id}`))
    }

    const onInsert = async() =>{
        if(contents==""){
            alert("댓글 내용을 입력하세요!");
            return;
        }
        const data ={
            pid : id,
            email,
            contents, //email을 email에 contents를 contents와 같이 이름이 같은 변수에 넣을때 : 생략가능
            date:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
        console.log(data);
        await addDoc(collection(db,`/comments`),data);
        alert("댓글등록 완료");
        setContents("");
    }
    

    const onClickUpdate = (id) => {
        const data=comments.map(com=>com.id===id ? {...com,isEdit:true}:com);
        setComments(data);
    }

    const onChangeContents =(e,id)=>{
        const data=comments.map(com=>com.id===id ?{...com,contents:e.target.value} : com);
        setComments(data);
    }
    const onClickCancle = (comment) =>{
        if(comment.contents !== comment.text){
            if(window.confirm("정말로 취소하실래요?")){
                const data=comments.map(com=>com.id===comment.id ? {...com,isEdit:false,contents: com.text} : com);
                setComments(data);
            }
        }else{
            const data = comments.map(com=>com.id===comment.id ? {...com,isEdit:false} : com);
            setComments(data);
        }
    }

    const onClickSave = async(com) =>{
        console.log(com);
        if(com.text !== com.contents){
            if(!window.confirm('변경된 내용을 저장하실래요?')) return;
            //변경내용 저장
            await updateDoc(doc(db,`/comments/${com.id}`),com);
        }
        callAPI();
    }


    return (
        <div className='my-5'>
            {!email ?
                <div className='text-end'>
                    <Button className='px-5' onClick={onClickInsert}>댓글등록</Button>
                </div>
                :
                <div>
                    <Form.Control value={contents} onChange={(e)=>setContents(e.target.value)}
                        as='textarea' rows={5} placeholder='댓글 내용을 입력하세요.'/>
                    <div className='text-end my-2'>
                        <Button onClick={onInsert}
                            className='px-3'>등록</Button>
                    </div>
                </div>
            }
            <div className='my-5'>
                {comments.map(com=>
                    <div key={com.id}>
                        <Row>
                            <Col className='text-muted'>
                                <span className='me-2'>{com.email}</span>
                                <span>{com.date}</span>
                            </Col>
                            {email===com.email && !com.isEdit &&
                                <Col className='text-end'>
                                    <Button onClick={()=>onClickUpdate(com.id)}
                                        size='sm' className='me-2'>수정</Button>
                                    <Button onClick={()=>onClickDelete(com.id)}
                                        size='sm' variant='danger'>삭제</Button> 
                                </Col>
                            }
                            {email===com.email && com.isEdit &&
                                <Col className='text-end'>
                                    <Button onClick={()=>onClickSave(com)}
                                        size='sm' className='me-2' variant='success'>저장</Button>
                                    <Button onClick={()=>onClickCancle(com)}
                                        size='sm' variant='secondary'>취소</Button> 
                                </Col>
                            }
                        </Row>
                        {com.isEdit ?
                                <Form.Control onChange={(e)=>onChangeContents(e,com.id)}
                                    value={com.contents} as="textarea" rows={5}/>
                            :
                            <div onClick={()=>{onClickContents(com.id)}} 
                                style={{whiteSpace:'pre-wrap', cursor:'pointer'}}
                                className={com.ellip && 'ellipsis'}>{com.contents}</div>
                        }
                        
                        <hr/>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Comments
