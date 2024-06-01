import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {app} from '../../firebaseinit';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import {Row,Col,Button, Card} from 'react-bootstrap';

const ReadPage = () => {
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

    return (
        <Row>
            <Col>
                <h1>게시글정보</h1>
                {loginEmail==email &&
                    <div className='text-end mb-2'>
                        <Button variant='success' size="sm" className='me-1 px-3'>수정</Button>
                        <Button variand='danger' size="sm" className='px-3'>삭제</Button>
                    </div>
                }
                <Card>
                    <Card.Body>
                        <h5>{title}</h5>
                        <div className='text-muted'>
                            <span className='me-3'>{date}</span>
                            <span>{email}</span>
                        </div>
                        <hr/>
                        <div style={{whiteSpace:'pre-wrap'}}>{contents}</div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default ReadPage
