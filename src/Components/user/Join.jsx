import React, { useState } from 'react'
import {Row,Col,Form,InputGroup, Card, Button} from 'react-bootstrap'
import {app} from '../../firebaseinit'
import {createUserWithEmailAndPassword, getAuth} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Join = () => {
    const navi = useNavigate();
    const [loading,setLoading] = useState(false);
    const auth=getAuth(app);
    const [form, setForm] = useState({
        email:'blue@test.com',
        pass:'12341234'
    });
    const {email,pass} = form;
    const onChange = (e) =>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit =(e)=>{
        e.preventDefault();
        if(email === "" || pass ===""){
            alert("이메일과 비밀번호를 입력하세요.")
        }else{
            //로그인체크
            setLoading(true);
            createUserWithEmailAndPassword(auth, email, pass)
            .then(success=>{
                alert('이메일 가입  성공!');
                setLoading(false);
                navi('/login');
            })
            .catch(error=>{
                alert("에러:" + error.message);
                setLoading(false);
            })
        }
    }

    if(loading) return <h1 className='my-5'>로딩중입니다...</h1>

    return (
        <Row className='my-5' justify-content-center>
            <Col md={6} lg={4}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>회원가입</h3>
                    </Card.Header>
                    <Card.Body>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{width:100}} className='justify-content-center'>이메일</InputGroup.Text>
                                <Form.Control name="email" placeholder='이메일을 입력해주세요.' value={email} onChange={onChange}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{width:100}} className='justify-content-center'>비밀번호</InputGroup.Text>
                                <Form.Control name="pass" placeholder='비밀번호를 입력해주세요.' type="password" value={pass} onChange={onChange}/>
                            </InputGroup>
                            <div>
                                <Button className='w-100' type="submit">회원가입</Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
  )
}

export default Join
