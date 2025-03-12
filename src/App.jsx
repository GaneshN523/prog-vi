import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';

import MemoryVisualizer from './components/Basic/MemoryVisualizer/MemoryVisualizer';
import DataTypesVisualizer from './components/Basic/DataTypes/DataTypesVisualizer';
import AExpressionVisualizer from './components/Basic/Expressions/AExpressionVisualizer';
import ConditionalVisualizer from './components/Basic/Conditions/ConditionalVisualizer';
import LoopSimulator from './components/Basic/Loops/LoopSimulator';
import FunctionSimulator from './components/Basic/Functions/FunctionSimulator';
import PointerVisualizer from './components/Basic/Pointers/PointerVisualization';
import ArrayVisualizer from './components/DataStructures/Arrays/ArrayVisualizer';
import SparseMatrixVisualizer from './components/DataStructures/SparseMatrices/SparseMatrixVisualizer';
import LinkedListVisualizer from './components/DataStructures/LinkedList/LinkedListVisualizer';
import StackVisualizer from './components/DataStructures/Stacks/StackVisualizer';
import QueueVisualizer from './components/DataStructures/Queues/QueueVisualizer';
import RecursionVisualizer from './components/Basic/Recursion/RecursionVisualizer';
import TreeVisualizer from './components/DataStructures/Trees/TreeVisualizer';
import HeapVisualizer from './components/DataStructures/Heaps/HeapVisualizer';
import GraphVisualizer from './components/DataStructures/GraphVisualizer/GraphVisualizer';
import HashMapVisualizer from './components/DataStructures/HashMaps/HashMapVisualizer';
import OOPVisualizer from './components/oops/ClassesObjects/ClassesObjects';
import ConstructorsDestructorsVisualizer from './components/oops/CDStructors/ConstructorsDestructorsVisualizer';
import EncapsulationVisualizer from './components/oops/EncapsulationVisualizer/EncapsulationVisualizer';
import AbstractionVisualizer from './components/oops/AbstractionVisualizer/AbstractionVisualizer';
import InheritanceVisualizer from './components/oops/InheritanceVisualizer/InheritanceVisualizer';
import PolymorphismVisualizer from './components/oops/Polymorphism/PolymorphismVIsualizer';

import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<MemoryVisualizer />} />
            <Route path="/data-types" element={<DataTypesVisualizer />} />
            <Route path="/a-expression" element={<AExpressionVisualizer />} />
            <Route path="/conditional" element={<ConditionalVisualizer />} />
            <Route path="/loop" element={<LoopSimulator />} />
            <Route path="/function" element={<FunctionSimulator />} />
            <Route path="/pointer" element={<PointerVisualizer />} />
            <Route path="/array" element={<ArrayVisualizer />} />
            <Route path="/sparse-matrix" element={<SparseMatrixVisualizer />} />
            <Route path="/linked-list" element={<LinkedListVisualizer />} />
            <Route path="/stack" element={<StackVisualizer />} />
            <Route path="/queue" element={<QueueVisualizer />} />
            <Route path="/recursion" element={<RecursionVisualizer />} />
            <Route path="/tree" element={<TreeVisualizer />} />
            <Route path="/heap" element={<HeapVisualizer />} />
            <Route path="/graph" element={<GraphVisualizer />} />
            <Route path="/hashmap" element={<HashMapVisualizer />} />
            <Route path="/oop" element={<OOPVisualizer />} />
            <Route path="/constructors-destructors" element={<ConstructorsDestructorsVisualizer />} />
            <Route path="/encapsulation" element={<EncapsulationVisualizer />} />
            <Route path="/abstraction" element={<AbstractionVisualizer />} />
            <Route path="/inheritance" element={<InheritanceVisualizer />} />
            <Route path="/polymorphism" element={<PolymorphismVisualizer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
