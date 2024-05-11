import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Row, Col, Card, Form, Button, InputGroup} from 'react-bootstrap'
import { CiShoppingCart } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import {app} from '../../firebaseinit'
import {getDatabase, ref, set, get} from 'firebase/database'


const Books = () => {
    const db = getDatabase(app);
    const navi = useNavigate();
    const uid=sessionStorage.getItem('uid');
    const [page,setPage] = useState(1);
    const [query,setQuery] = useState('자바');
    const [loading, setLoading] = useState(false);
    const [books,setBooks] = useState([]);
    const callAPI = async() => {
        setLoading(true);
        const url=`https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12&page=${page}`;
        const config={
            headers:{"Authorization":"KakaoAK 96940d92ecbaa62f62139f795286f72a"}
        };
        const res = await axios.get(url,config);
        console.log(res.data);
        setBooks(res.data.documents);
        setLoading(false);
        
    }

    useEffect(()=>{
        callAPI();
    },[page]);

    const onSubmit = (e) =>{
        e.preventDefault();
        setPage(1);
        callAPI();
    }

    const onClickCart=(book)=>{
        if(uid){
            //장바구니에 도서넣기
            if(window.confirm(`"${book.title}"\n장바구니에 넣으실래요?`)){
                get(ref(db,`cart/${uid}/${book.isbn}`)).then(snapshot=>{
                    if(snapshot.exists()){
                        alert("이미 장바구니에 있습니다.");
                    }else{
                        set(ref(db,`cart/${uid}/${book.isbn}`),{...book});
                        alert('장바구니 넣기 완료');
                    }
                })
            }
        }else{
            //세션스토리지는 모든 페이지에서 사용가능
            sessionStorage.setItem('target','/books');
            navi('/login');
        }
    }

    if(loading) return <h1 className='my-5'>로딩중입니다...</h1>
    return (
        <div>
            <h1 className='my-5'>도서검색</h1>
            <Row className='mb-2'>
                <Col xs={8} md={6} lg={4}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control onChange={(e)=>setQuery(e.target.value)}
                                placeholder='검색어' value={query}/>
                            <Button type="submit">검색</Button>
                        </InputGroup>
                    </form>
                </Col>
            </Row>
            <Row>
                {books.map(book=>
                /* 반복해서 랜더링할 내용을 넣음 */
                    <Col key={book.isbn} xs={6} md={4} lg={2} className='mb-2'>
                        <Card>
                            <Card.Body className='justify-content-center d-flex'>
                                <img src={book.thumbnail || 'http://via.placeholder.com/120x170'} alt="face"/>
                            </Card.Body>
                            <Card.Footer>
                                <div className='ellipsis'>{book.title}</div>
                                <CiShoppingCart onClick={()=>onClickCart(book)}
                                    style={{cursor:'pointer',fontSize:'20px', color:'green'}}/>
                            </Card.Footer>
                        </Card>
                    </Col>

                )}
            </Row>
            <div className='text-center my-3'>
                <Button onClick={()=>setPage(page-1)} disabled={page===1}>이전</Button>
                <span className='mx-2'>{page}</span>
                <Button onClick={()=>setPage(page+1)}>다음</Button>
            </div>
        </div>
    )
}

export default Books
