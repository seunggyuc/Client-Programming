import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import {app} from '../../firebaseinit';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore';
import {Row,Col,Button, Card} from 'react-bootstrap';
import Comments from './Comments';

const ReadPage = () => {
    const navi = useNavigate();
    const loginEmail = sessionStorage.getItem('email');
    const [post,setPost] = useState('');
    const {id} = useParams();
    const db = getFirestore(app);
    const callAPI = async() =>{
        const res = await getDoc(doc(db,`posts/${id}`));
        // console.log(res);
        setPost(res.data());
    }
    const {email,date,title,contents} = post;

    useEffect(()=>{
        callAPI();
    },[])

    const onClickDelete = async() =>{
        if(!window.confirm(`${id}번 게시글을 삭제하실래요?`))   return;
        //게시글삭제
        await deleteDoc(doc(db,`/posts/${id}`));
        // window.location.href='/bbs';
        navi('/bbs') //방법 2개임
    }
    
    return (
        <Row className='justify-content-center my-5'>
            <Col xs={10} md={8} lg={7}>
                <h1 className='my-5'>게시글정보</h1>
                {loginEmail===email &&
                    <div className='mb-2 text-end'>
                        <Button onClick={()=>navi(`/bbs/update/${id}`)}
                            variant='success' size="sm" className='me-1 px-3'>수정</Button>
                        <Button onClick={onClickDelete}
                            variand='danger' size="sm" className='px-3'>삭제</Button>
                    </div>
                }
                <Card>
                    <Card.Body>
                        <h5>{title}</h5>
                        <div className='text-muted justify-content-center'>
                            <span className='me-3'>{date}</span>
                            <span>{email}</span>
                        </div>
                        <hr/>
                        <div style={{whiteSpace:'pre-wrap'}}>{contents}</div>
                    </Card.Body>
                </Card>
                <Comments/>
            </Col>
        </Row>
    )
}

export default ReadPage
