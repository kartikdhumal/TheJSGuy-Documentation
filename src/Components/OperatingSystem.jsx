import React, { useEffect } from 'react'
import '../styles/debouncing.css';

function OperatingSystem() {
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo(0, 0);
        }
    }, []);

    return (
        <div className='debounce-container'>
            <h1 className="section-title">Operating System</h1>

            <div id="process-and-thread" className="faq-item">
                <h3 className="faq-question">What is the difference between a process and a thread?</h3>
                <p className="faq-answer">
                    <div>
                        <p>Process: A process is an execution of a program with its own memory and resources.</p>
                        <p>Thread: A thread is a lightweight execution unit within a process that shares memory and resources with other threads.</p>
                    </div>
                </p>
            </div>

            <div id="process-states" className="faq-item">
                <h3 className="faq-question">What are the different states of a process?</h3>
                <p className="faq-answer">
                    <div>
                        <p>New: The process is being created.</p>
                        <p>Ready: Waiting to get CPU time.</p>
                        <p>Running: Instructions are being executed.</p>
                        <p>Waiting/Blocked: Waiting for some event like I/O.</p>
                        <p>Terminated: Process finished execution.</p>
                    </div>
                </p>
            </div>

            <div id="context-switching" className="faq-item">
                <h3 className="faq-question">What is context switching?</h3>
                <p className="faq-answer">
                    <div>
                        <p>Context switching is the process of storing the state of a CPU so that multiple processes can share a single CPU efficiently. It allows a process to resume execution from the point it was interrupted.</p>
                    </div>
                </p>
            </div>

            <div id="scheduling" className="faq-item">
                <h3 className="faq-question">Explain scheduling algorithms.</h3>
                <p className="faq-answer">
                    <div>
                        <p>FCFS (First Come First Serve): Processes executed in order of arrival.</p>
                        <p>SJF (Shortest Job First): Process with the smallest execution time scheduled next.</p>
                        <p>Priority Scheduling: Processes executed based on priority.</p>
                        <p>Round Robin: Each process given fixed time slice in cyclic order.</p>
                        <p>Multilevel Queue Scheduling: Processes divided into queues based on priority/type.</p>
                    </div>
                </p>
            </div>

            <div id="deadlock" className="faq-item">
                <h3 className="faq-question">What is deadlock and how can it be prevented?</h3>
                <p className="faq-answer">
                    <div>
                        <p>Deadlock: A situation where processes are waiting indefinitely for resources held by each other.</p>
                        <p>Prevention methods:</p>
                        <div>
                            <p>- Avoid mutual exclusion wherever possible.</p>
                            <p>- Eliminate circular wait.</p>
                            <p>- Allow preemption of resources.</p>
                            <p>- Prevent hold-and-wait conditions.</p>
                        </div>
                    </div>
                </p>
            </div>

            <div id="memory-management" className="faq-item">
                <h3 className="faq-question">Explain memory management techniques.</h3>
                <p className="faq-answer">
                    <div>
                        <p>Paging: Divides memory into fixed-size pages to eliminate fragmentation.</p>
                        <p>Segmentation: Divides memory into variable-sized logical segments.</p>
                        <p>Virtual Memory: Allows processes to use more memory than physically available by swapping pages between disk and RAM.</p>
                        <p>Page Replacement Algorithms: FIFO, LRU, Optimal.</p>
                    </div>
                </p>
            </div>

            <div id="synchronization" className="faq-item">
                <h3 className="faq-question">What are semaphores and mutexes?</h3>
                <p className="faq-answer">
                    <div>
                        <p>Semaphores: Signaling mechanism to control access to shared resources (binary or counting).</p>
                        <p>Mutex: Mutual exclusion lock allowing only one thread to access a resource at a time.</p>
                    </div>
                </p>
            </div>

            <div id="file-systems" className="faq-item">
                <h3 className="faq-question">Explain types of file systems.</h3>
                <p className="faq-answer">
                    <div>
                        <p>FAT, NTFS, ext3/ext4</p>
                        <p>Access methods: Sequential, direct, or indexed.</p>
                    </div>
                </p>
            </div>

            <div id="io-management" className="faq-item">
                <h3 className="faq-question">Explain I/O management and scheduling.</h3>
                <p className="faq-answer">
                    <div>
                        <p>I/O management ensures efficient device utilization through buffering, spooling, and interrupt-driven I/O.</p>
                        <p>Common I/O scheduling algorithms: FCFS, SSTF, SCAN, C-SCAN.</p>
                    </div>
                </p>
            </div>

            <div id="practical-examples" className="faq-item">
                <h3 className="faq-question">Practical OS interview examples</h3>
                <p className="faq-answer">
                    <div>
                        <p>Implement the Producer-Consumer Problem.</p>
                        <p>Detect deadlock from a resource allocation table.</p>
                        <p>Simulate page replacement algorithms (FIFO, LRU).</p>
                        <p>Design a basic CPU scheduler simulator.</p>
                    </div>
                </p>
            </div>

        </div>
    )
}

export default OperatingSystem;
