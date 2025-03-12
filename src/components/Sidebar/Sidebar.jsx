import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      {/* Toggle button visible on mobile */}
      <button className={styles.sidebarToggle} onClick={toggleSidebar}>
        {isOpen ? '<' : '>'}
      </button>

      {/* Sidebar with conditional open class for mobile responsiveness */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Close button inside sidebar for mobile */}
        <button className={styles.sidebarClose} onClick={toggleSidebar}>
          &times;
        </button>
        <nav>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/">Memory Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/data-types">Data Types Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/a-expression">A Expression Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/conditional">Conditional Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/loop">Loop Simulator</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/function">Function Simulator</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/pointer">Pointer Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/array">Array Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/sparse-matrix">Sparse Matrix Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/linked-list">Linked List Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/stack">Stack Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/queue">Queue Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/recursion">Recursion Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/tree">Tree Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/heap">Heap Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/graph">Graph Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/hashmap">HashMap Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/oop">OOP Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/constructors-destructors">Constructors & Destructors</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/encapsulation">Encapsulation Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/abstraction">Abstraction Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/inheritance">Inheritance Visualizer</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/polymorphism">Polymorphism Visualizer</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
