// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateVerifier {

    // Estructura para almacenar los detalles del certificado
    struct Certificate {
        uint256 id;
        string title;
        string issuedBy;
        uint256 issueDate;
        bool isValid;
    }

    // Mapeo para almacenar certificados con su ID único
    mapping(uint256 => Certificate) public certificates;

    // Evento que se emite cuando se agrega un nuevo certificado
    event CertificateAdded(uint256 id, string title, string issuedBy, uint256 issueDate, bool isValid);

    // Modificador para verificar que el certificado existe
    modifier certificateExists(uint256 _id) {
        require(certificates[_id].id != 0, "Certificado no encontrado");
        _;
    }

    // Función para agregar un nuevo certificado
    function addCertificate(
        uint256 _id,
        string memory _title,
        string memory _issuedBy,
        uint256 _issueDate,
        bool _isValid
    ) public {
        // Verifica que el certificado no exista ya
        require(certificates[_id].id == 0, "Certificado ya existe");

        // Agrega el nuevo certificado
        certificates[_id] = Certificate({
            id: _id,
            title: _title,
            issuedBy: _issuedBy,
            issueDate: _issueDate,
            isValid: _isValid
        });

        // Emite un evento para notificar la adición del certificado
        emit CertificateAdded(_id, _title, _issuedBy, _issueDate, _isValid);
    }

    // Función para verificar la validez de un certificado
    function verifyCertificate(uint256 _id) public view certificateExists(_id) returns (string memory title, string memory issuedBy, uint256 issueDate, bool isValid) {
        Certificate memory cert = certificates[_id];
        return (cert.title, cert.issuedBy, cert.issueDate, cert.isValid);
    }

    // Función para actualizar la validez de un certificado
    function updateCertificateValidity(uint256 _id, bool _isValid) public certificateExists(_id) {
        certificates[_id].isValid = _isValid;
    }
}
