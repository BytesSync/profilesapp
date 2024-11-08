import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import AWS from 'aws-sdk';

const S3_BUCKET_NAME = 'eobdbucket';
const CSV_FILE_KEY = 'obdii.csv';

// AWS.config.update({
//   region: 'your-region',
//   accessKeyId: 'your-access-key-id',
//   secretAccessKey: 'your-secret-access-key',
// });

function CsvTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const s3 = new AWS.S3();
    s3.getObject({ Bucket: S3_BUCKET_NAME, Key: CSV_FILE_KEY }, (error, data) => {
      if (error) {
        console.error('Error fetching CSV from S3:', error);
        return;
      }

      const csvData = data.Body.toString('utf-8');
      Papa.parse(csvData, {
        header: true,
        complete: (result) => {
          setData(result.data);
        },
      });
    });
  }, []);

  return (
    <table>
      <thead>
        <tr>
          {data.length > 0 && Object.keys(data[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.values(row).map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function App() {
  return (
    <div>
      <h1>CSV Data from S3</h1>
      <CsvTable />
    </div>
  );
}
