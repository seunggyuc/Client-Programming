import React, { useEffect, useState } from 'react'
import {app} from '../../firebaseinit'
import {getDatabase, onValue, ref, remove} from 'firebase/database'
import {Button, Table} from 'react-bootstrap'

const Cart = () => {
  const [loading,setLoading] = useState(false);
  const [books,setBooks] = useState([]);
  const uid=sessionStorage.getItem('uid');
  const db = getDatabase(app);

  const callAPI =()=>{
    setLoading(true);
    onValue(ref(db,`cart/${uid}`), snapshot=>{
      // console.log(snapshot.key, snapshot.val());
      const rows=[];
      snapshot.forEach(row=>{
        rows.push({key:row.key, ...row.val()})
      });
      console.log(rows);
      setBooks(rows);
      setLoading(false);
    });
  }

  const onClickDelete = (book) => {
    if(window.confirm(`${book.title}\n삭제하시겠습니까?`)){
      //삭제하기
      remove(ref(db,`cart/${uid}/${book.isbn}`));
    }
  }

  useEffect(()=>{
    callAPI();
  },[])



  if(loading) return <h1 className='my-5'>장바구니 로딩중입니다...</h1>


  return (
    <div>
        <h1>장바구니</h1>
        <Table>
          <thead>
            <tr>
              <td colSpan={2}>도서제목</td>
              <td>가격</td>
              <td>저자</td>
              <td>삭제</td>
            </tr>
          </thead>
          <tbody>
            {books.map(book=>
              <tr key={book.isbn}>
                <td><img src={book.thumbnail} width="30px"/></td>
                <td>{book.title}</td>
                <td>{book.price}</td>
                <td>{book.authors}</td>
                <td><Button onClick={()=>onClickDelete(book)}
                  variant='danger' className='btn-sm'>삭제</Button></td>
              </tr>
            )}
              
          </tbody>
        </Table>
    </div>
  )
}

export default Cart

