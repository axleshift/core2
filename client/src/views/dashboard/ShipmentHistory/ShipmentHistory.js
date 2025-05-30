import React, { useState, useEffect } from 'react'
import axios from '../../../api/axios'
import { ring } from 'ldrs'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
ring.register()
import { useStateContext } from '../../../context/contextProvider'
const ShipmentHistory = () => {
  const [shipmentHistory, setShipmentHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useStateContext()
  const [editMode, setEditMode] = useState(null)
  useEffect(() => {
    const fetchShipmentHistory = async () => {
      try {
        const response = await axios.get('/history')
        const data = response.data
        if (data.status === 'success') {
          setShipmentHistory(data.data)
        } else {
          setShipmentHistory([])
        }
      } catch (error) {
        console.error('Error fetching shipment history:', error)
        setShipmentHistory([])
      } finally {
        setLoading(false)
      }
    }
    fetchShipmentHistory()
  }, [])

  const handleDelete = async (trackingNumber) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      try {
        const response = await axios.delete(`/api/track/${trackingNumber}`)

        if (response.data.status === 'success') {
          setShipmentHistory((prevHistory) =>
            prevHistory.filter((shipment) => shipment.trackingNumber !== trackingNumber),
          )
          setEditMode(null)
        } else {
          alert('Error deleting shipment: ' + response.data.message)
        }
      } catch (error) {
        console.error('Error deleting shipment:', error)
        alert('An error occurred while deleting the shipment.')
      }
    }
  }

  const handleEditClick = (trackingNumber) => {
    setEditMode(trackingNumber)
  }

  return (
    <div id="shipment-history">
      <h2>Shipment History</h2>
      {loading ? (
        <span>
          <l-ring size="40" stroke="5" bg-opacity="0" speed="2" color="black" />
        </span>
      ) : (
        <table id="history-table">
          <thead>
            <tr>
              <th>Tracking Number</th>
              <th>Status</th>
              <th>Date Received</th>
              <th>Delivery Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipmentHistory.length > 0 ? (
              shipmentHistory.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.trackingNumber}</td>
                  <td>{entry.status}</td>
                  <td>{new Date(entry.updated_at).toLocaleString()}</td>
                  <td>{entry.deliveryAddress}</td>
                  <td>
                    {user?.userRole === 'admin' ? (
                      <button onClick={() => handleDelete(entry.trackingNumber)} className="delete">
                        <CIcon icon={cilTrash} />
                      </button>
                    ) : (
                      <span>No Actions Available</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No shipment history available.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ShipmentHistory
