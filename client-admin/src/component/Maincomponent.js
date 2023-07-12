import React, { Component } from 'react';
import MyContext from '../contexts/Mycontext';
import Menu from './Menucomponent';
import Home from './Homecomponent';
import { Routes, Route, Navigate } from 'react-router-dom';
import Category from './Categorycomponent';
import Product from './Productcomponent';
import Customer from './CustomerComponent';
import Order from './OrderComponent';

class Main extends Component {
  static contextType = MyContext; // using this.context to access global state
  render() {
    if (this.context.token !== '') {
      return (
        <div className="body-admin">
          <Menu />
          <Routes>
            <Route path='/admin' element={<Navigate replace to='/admin/home' />} />
            <Route path='/admin/home' element={<Home />} />
            <Route path='/admin/categories' element={<Category />} />
            <Route path='/admin/product' element={<Product />} />
            <Route path='/admin/order' element={<Order />} />
            <Route path='/admin/customer' element={<Customer />} />
          </Routes>
        </div>
      );
    }
    return (<div />);
  }
}
export default Main;